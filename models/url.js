const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');
const ShortUniqueId = require('short-unique-id').default;

const urlSchema = new mongoose.Schema({
    url: { 
      type: String,
      required: true,
      maxlength:255,
      minlength:5     
    },
    shorturlkey:{
        type: String,
        required: true,
        maxlength:10,
        minlength:5,
        unique:true,
        default: function(){
            const uid = new ShortUniqueId();
            return uid.randomUUID(config.get('shorturlkeyCharacterCount')) 
        }  
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref:'Users'
    }
  });

const Url = mongoose.model('Urls', urlSchema);

function validateUrl(url){
    const schema = Joi.object({
        url: Joi.string().min(5).max(100).required(),
        shorturlkey: Joi.string().min(5).max(10),
        user: Joi.objectId().required(),
    });

    return schema.validate(url);
}

exports.Url = Url;
exports.validate = validateUrl;