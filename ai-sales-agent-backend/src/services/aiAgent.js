const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db/pool');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

const model = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  systemInstruction: systemPrompt,
});

  // Gemini requires the history to start with a 'user' turn, and roles must alternate.
  // We map sender_type -> Gemini roles ('user' for customer, 'model' for ai/human replies).
  const history = conversationHistory
    .map((msg) => ({
      role: msg.sender_type === 'customer' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

  const chat = model.startChat({ history });

  const result = await chat.sendMessage(newMessage);
  const replyText = result.response.text();

  return replyText || "I'm sorry, I couldn't generate a response right now.";
}

module.exports = { generateReply, buildSystemPrompt };