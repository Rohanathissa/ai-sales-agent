require('dotenv').config();
const app = require('./app');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () => {
  console.log(`AI Sales Agent listening on http://${HOST}:${PORT}`);
});
