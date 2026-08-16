import app from './app.js';
import { env } from './config/env.js';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
