const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
const mongoose = require('mongoose');

const URI = process.env.DB_URI;

const DB = mongoose.connect(URI).then(() => {
  console.log('Database CONNECTED');
});
// .catch((err) => {
//   console.log(err);
// });

module.exports = DB;
