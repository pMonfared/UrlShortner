const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () { 
  const db = `${config.get('db')}`;
  console.log('connectionString:', db);
  mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
      })
      .then(()=> winston.info(`Connected to ${db}...`));
}