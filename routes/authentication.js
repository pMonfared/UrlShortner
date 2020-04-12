const _ = require('lodash');
const Joi = require('joi');

const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

// joi-password-complexity

router.post('/', async (req,res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.lookup(req.body.emailOrUsername,req.body.emailOrUsername);
    if (!user) return res.status(400).send('Invalid email/username or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email/username or password');

    const token = user.generateAuthToken();
    res.send({ token });
});


function generateAuthToken() {

}


function validate(req){
    const schema = {
        emailOrUsername: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(req,schema);
}

module.exports = router;