const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: { 
      type: String,
      required: true,
      maxlength:50,
      minlength:5,      
    },
    email: { 
        type: String,
        required: true,
        maxlength:255,
        minlength:5,
        unique:true     
    },
    password: { 
        type: String,
        required: true,
        maxlength:1024,
        minlength:5,      
    },
    isAdmin: {
      type: Boolean
    },
    roles:{
      type: Array
    },
    operates:{
      type: Array
    }
  });

  userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
       _id: this._id,
       isAdmin: this.isAdmin
       }, config.get('jwtPrivateKey'));
    return token;
  }

const User = mongoose.model('Users', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;