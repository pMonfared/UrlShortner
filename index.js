

const express = require('express');
const winston = require('winston');
require('express-async-errors');

const app = express();
require('./startup/prod')(app);
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{ winston.info(`Listening on port ${port}...`); });
  

module.exports = server;