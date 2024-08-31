process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! 💥 Shutting down...');
  // console.log(err.name, err.message);
  process.exit(1);
});

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const dbConnect = require('./database/connect');

const port = process.env.PORT || 8080;

app.use((req, res, next) => {
  dbConnect;
  next();
});

const server = app.listen(port, () => {
  // console.log(`Server is runing on port ${port}`);
  console.log(`127.0.0.1:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandeled Rejection! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
