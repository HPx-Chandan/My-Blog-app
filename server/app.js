const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');
const AppErr = require('./utils/AppErr');
const globalErrorHandler = require('./globalErrHandler');
const path = require('path');
const app = express();

const allowedOrigin = process.env.ORIGIN || '*';

app.use(express.json({ extends: true }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

app.use('*', (req, res, next) => {
  next(new AppErr(`Cant find ${req.originalUrl} on this Server! `, 404));
});

app.use(globalErrorHandler);

module.exports = app;
