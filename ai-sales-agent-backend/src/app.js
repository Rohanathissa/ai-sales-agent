const express = require('express');
const cors = require('cors');

const businessesRouter = require('./routes/businesses');
const productsRouter = require('./routes/products');
const customersRouter = require('./routes/customers');
const conversationsRouter = require('./routes/conversations');
const conversationDetailRouter = require('./routes/conversationDetail');
const messagesRouter = require('./routes/messages');
const businessRulesRouter = require('./routes/businessRules');
const authRouter = require('./routes/auth');
const { authenticate } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const usersRouter = require('./routes/users');
const whatsappWebhookRouter = require('./routes/whatsappWebhook');

const app = express();

app.use(cors());
app.use(express.json());

// Health check - public
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public Privacy Policy, Terms of Service & Return Policy for Meta App verification & Commerce Compliance
const legalHtmlTemplate = (title, badge, bodyContent) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - GemConnect AI Sales Platform</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 840px; margin: 40px auto; padding: 0 24px 60px; line-height: 1.65; color: #1e293b; background: #f8fafc; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
    .badge { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; }
    h1 { color: #0f172a; margin-top: 0; font-size: 26px; }
    h2 { color: #0f172a; margin-top: 28px; font-size: 18px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    p, li { color: #334155; font-size: 14.5px; }
    .nav-bar { display: flex; gap: 12px; margin-bottom: 24px; }
    .nav-link { color: #2563eb; text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 4px 8px; border-radius: 4px; }
    .nav-link:hover { background: #eff6ff; }
    .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12.5px; color: #64748b; }
    .contact-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="nav-bar">
    <a class="nav-link" href="/privacy">🛡️ Privacy Policy</a>
    <a class="nav-link" href="/terms">📜 Terms of Service</a>
    <a class="nav-link" href="/return-policy">🔄 Return & Refund Policy</a>
  </div>
  <div class="card">
    <span class="badge">${badge}</span>
    <h1>${title}</h1>
    <p><em>Last updated: October 2026 • GemConnect (Pvt) Ltd</em></p>
    ${bodyContent}
    <div class="footer">
      © 2026 GemConnect (Pvt) Ltd. All Rights Reserved. WhatsApp Meta Cloud API & Google Gemini AI Enterprise Partner.
    </div>
  </div>
</body>
</html>`;

app.get('/privacy', (req, res) => {
  res.send(legalHtmlTemplate(
    'Privacy Policy',
    'META APP REVIEW COMPLIANT',
    `<h2>1. Data Collection</h2>
    <p>GemConnect AI Sales Agent collects customer contact information (WhatsApp phone number, profile display name) and customer conversation messages exclusively to answer inquiries regarding gem catalog products, availability, and prices.</p>
    <h2>2. Artificial Intelligence & Data Protection</h2>
    <p>Inquiries are processed via Google Gemini AI API over encrypted server connections. We do not sell, rent, or distribute personal customer data to any third-party brokers or advertisers, nor is data used to train public models.</p>
    <h2>3. Data Retention & Erasure</h2>
    <p>Customers can request complete erasure of their conversation history at any time by sending "DELETE MY DATA" via WhatsApp or contacting privacy@gemconnect.lk.</p>
    <div class="contact-box">
      <strong>Privacy Contact:</strong><br>
      GemConnect (Pvt) Ltd, Colombo, Sri Lanka<br>
      Email: privacy@gemconnect.lk | Phone: +94 77 123 4567
    </div>`
  ));
});

app.get('/terms', (req, res) => {
  res.send(legalHtmlTemplate(
    'Terms of Service',
    'TERMS & CONDITIONS',
    `<h2>1. Service Description</h2>
    <p>GemConnect provides automated conversational customer service and sales guidance for authentic gemstones and fine jewellery via WhatsApp.</p>
    <h2>2. Quotations & Certified Inventory</h2>
    <p>Quotes and availability provided by our automated assistant reflect real-time inventory. All precious gemstones include genuine laboratory certifications (NGJA/GIA). Formal purchase contracts are established upon issue of an official invoice.</p>
    <h2>3. Governing Law</h2>
    <p>These terms are governed by the laws of Sri Lanka. Any disputes are subject to the commercial jurisdiction of Colombo courts.</p>
    <div class="contact-box">
      <strong>Contact:</strong> support@gemconnect.lk | Hotline: +94 77 123 4567
    </div>`
  ));
});

app.get(['/return-policy', '/refund-policy'], (req, res) => {
  res.send(legalHtmlTemplate(
    'Return & Refund Policy',
    'COMMERCE SATISFACTION GUARANTEE',
    `<h2>1. 14-Day Examination Guarantee</h2>
    <p>We offer a 14-day inspection window from the delivery date for all catalog gemstones and fine jewellery.</p>
    <h2>2. Return Eligibility</h2>
    <ul>
      <li>Items must be undamaged, unmounted, and in original condition.</li>
      <li>The tamper-evident security seal/tag must remain intact.</li>
      <li>Original laboratory certificate (NGJA/GIA) and receipt must accompany the return.</li>
    </ul>
    <h2>3. Refund Processing</h2>
    <p>Upon verification and gemological inspection (2 business days), refunds are issued via original payment channel within 5 to 7 business days.</p>
    <h2>4. Custom & Bespoke Orders</h2>
    <p>Custom-sized rings or specially commissioned bespoke mountings are non-returnable once customer-approved crafting has begun.</p>
    <div class="contact-box">
      <strong>Returns Department:</strong> returns@gemconnect.lk | WhatsApp: +94 77 123 4567
    </div>`
  ));
});

// WhatsApp Meta Webhook - public (verified by token)
app.use('/api/whatsapp/webhook', whatsappWebhookRouter);

// Auth routes - public (no token needed to register/login)
app.use('/api/auth', authRouter);

// Protected routes - token required
app.use('/api/businesses/:businessId/products', authenticate, productsRouter);
app.use('/api/businesses/:businessId/customers', authenticate, customersRouter);
app.use('/api/businesses/:businessId/conversations', authenticate, conversationsRouter);
app.use('/api/businesses/:businessId/rules', authenticate, businessRulesRouter);
app.use('/api/businesses', authenticate, businessesRouter);
app.use('/api/businesses/:businessId/users', authenticate, usersRouter);

app.use('/api/conversations/:conversationId/messages', authenticate, messagesRouter);
app.use('/api/conversations', authenticate, conversationDetailRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;