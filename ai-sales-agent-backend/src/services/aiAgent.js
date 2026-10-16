const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db/pool');

let genAI;

function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Builds a system prompt for the AI using the business's products and rules.
 */
async function buildSystemPrompt(businessId) {
  const businessResult = await pool.query(
    'SELECT name, business_type, description, currency FROM businesses WHERE id = $1',
    [businessId]
  );
  const business = businessResult.rows[0];

  const productsResult = await pool.query(
    `SELECT name, category, description, price, currency, stock_status
     FROM products WHERE business_id = $1 AND is_active = true`,
    [businessId]
  );
  const products = productsResult.rows;

  const rulesResult = await pool.query(
    'SELECT rule_name, rule_type, rule_value FROM business_rules WHERE business_id = $1 AND is_active = true',
    [businessId]
  );
  const rules = rulesResult.rows;

  const productList = products
    .map((p) => `- ${p.name} (${p.category || 'General'}): ${p.currency} ${p.price || 'N/A'} — ${p.stock_status}${p.description ? ` — ${p.description}` : ''}`)
    .join('\n');

  const rulesList = rules.length
    ? rules.map((r) => `- ${r.rule_name}: ${JSON.stringify(r.rule_value)}`).join('\n')
    : 'No special rules configured.';

  return `You are a friendly, professional sales assistant for "${business.name}", a ${business.business_type || 'business'}.
${business.description ? `About the business: ${business.description}` : ''}

Your job is to help customers via WhatsApp chat: answer product questions, share pricing, and guide them toward a purchase, without being pushy.

AVAILABLE PRODUCTS:
${productList || 'No products currently listed.'}

BUSINESS RULES:
${rulesList}

Guidelines:
- Keep replies short and conversational (WhatsApp style, 2-4 sentences max)
- Use the currency ${business.currency} when quoting prices
- LANGUAGE SUPPORT: Respond in the exact language used by the customer. If the customer messages in Sinhala (සිංහල) or Singlish, understand their request accurately, match it against the English product catalog details above, and reply in polite, clear Sinhala with accurate product meanings and pricing. If they message in English, reply in English.
- If a customer asks something you don't have info on, offer to connect them with a human team member
- Never make up product details or prices not listed above
- Be warm and helpful, not robotic`;
}

/**
 * Generates an AI reply given a business, conversation history, and new customer message.
 * conversationHistory: array of { sender_type: 'customer'|'ai'|'human', content: string }
 */
async function generateReply(businessId, conversationHistory, newMessage) {
  const systemPrompt = await buildSystemPrompt(businessId);

  const fallbackModels = [
    process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-3.5-flash',
  ];

  // Filter and map conversation history to ensure valid alternating Gemini format starting with 'user'
  const sanitizedHistory = [];
  let lastRole = null;

  for (const msg of conversationHistory) {
    const role = msg.sender_type === 'customer' ? 'user' : 'model';
    if (sanitizedHistory.length === 0 && role !== 'user') continue;
    if (role === lastRole) continue;

    sanitizedHistory.push({
      role,
      parts: [{ text: msg.content }],
    });
    lastRole = role;
  }

  // Gemini startChat history MUST end with 'model' so that chat.sendMessage(newMessage) is a valid 'user' turn!
  if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
    sanitizedHistory.pop();
  }

  let lastError = null;

  for (const mName of [...new Set(fallbackModels)]) {
    try {
      const model = getGenAI().getGenerativeModel({
        model: mName,
        systemInstruction: systemPrompt,
      });
      const chat = model.startChat({ history: sanitizedHistory });
      const result = await chat.sendMessage(newMessage);
      const replyText = result.response.text();
      if (replyText) {
        return replyText;
      }
    } catch (err) {
      console.warn(`Model ${mName} error: ${err.message}. Trying next fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model fallbacks failed.');
}

module.exports = { generateReply, buildSystemPrompt };