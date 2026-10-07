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

// Public Privacy Policy & Terms of Service for Meta App verification
app.get('/privacy', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head><title>Privacy Policy - GemConnect AI Sales Agent</title></head>
<body style="font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6;">
  <h1>Privacy Policy</h1>
  <p>Last updated: October 2026</p>
  <p>GemConnect AI Sales Agent respects your privacy. This policy describes how we collect and use data when communicating via WhatsApp.</p>
  <h2>Data Collection</h2>
  <p>We collect contact information (phone numbers) and customer chat messages solely to answer inquiries regarding gem catalog products and prices.</p>
  <h2>Data Protection</h2>
  <p>We do not sell, rent, or distribute personal information to any third parties.</p>
  <p>Contact: support@gemconnect.lk</p>
</body>
</html>`);
});

app.get('/terms', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head><title>Terms of Service - GemConnect</title></head>
<body style="font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6;">
  <h1>Terms of Service</h1>
  <p>GemConnect provides AI-driven customer inquiry responses for gem and jewellery products.</p>
</body>
</html>`);
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