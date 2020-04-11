
const express = require('express');

const users = require('../routes/users');
const authentication = require('../routes/authentication');
const home = require('../routes/home');

const error = require('../middleware/error');

module.exports = function (app) { 
    //Express advance config
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'))

    //Routes
    app.use('/api/users', users);
    app.use('/api/auth', authentication);
    
    app.use('/', home);

    //View config
    app.set('view engine', 'pug');
    app.set('views','./views');

    //Error middlewares
    app.use(error);
}