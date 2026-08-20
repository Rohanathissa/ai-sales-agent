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

const app = express();

app.use(cors());
app.use(express.json());

// Health check - public
app.get('/health', (req, res) => res.json({ status: 'ok' }));

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