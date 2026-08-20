const app = require('./app');
const env = require('./config/env');

const PORT = Number(env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`CULT backend listening on http://localhost:${PORT}`);
});