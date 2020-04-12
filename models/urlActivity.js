const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');


const urlActivitySchema = new mongoose.Schema({
    category: {
      type: String,
      required: true,
      enum: [ 'desktop', 'mobile'],
      lowercase: true,
      trim: true //remove all padding property
    },
    browser: { 
      type: String,
      required: true,
      lowercase: true,
      maxlength:20,
      minlength:3     
    },
    ip: { 
      type: String,
      required: true,
      maxlength:50,
      minlength:3     
    },
    activityDateTime: {
      type: Date,
      required: true,
      default:moment().toDate()
    },
    url: { 
      type: mongoose.Schema.Types.ObjectId,
      ref:'Urls'
    }
  });

 

const UrlActivity = mongoose.model('urlActivities', urlActivitySchema);

function validateUrlActivity(urlActivity){
    const schema = {
        category: Joi.string().required(),
        browser: Joi.string().min(3).max(20).required(),
        ip: Joi.string().min(3).max(50).required(),
        url: Joi.objectId().required()
    }

    return Joi.validate(urlActivity,schema);
}

exports.UrlActivity = UrlActivity;
exports.validate = validateUrlActivity;