const express = require('express');
const app = express();
const {indexRouter} = require('./routes/indexRoute');
const { errorHandler, notFoundHandler,validationError } = require('./middelwares/error.middleware');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(indexRouter);

app.use(validationError);
app.use(notFoundHandler);
app.use(errorHandler);

exports.app = app;