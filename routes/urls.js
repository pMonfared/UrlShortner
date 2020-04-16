
const auth = require('../middleware/authorization');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const Joi = require('@hapi/joi');

const express = require('express');
const router = express.Router();
const { Url, validate } = require('../models/url')

router.get('/',[auth], async (req,res) => {
    const urls = await Url
    .find({ user: req.user._id })
    .sort('shorturl')
    .select('_id url shorturlkey');

    res.send(urls);
});

router.get('/:id', [auth,validateObjectId], async (req,res)=> {

    const url = await Url.findOne({ user: req.user._id, _id: req.params.id}).select('_id url shorturlkey');
    if(!url) return res.status(404).send('The url with the given ID was not found');

    res.send(url);
});


router.post('/', auth, async (req,res)=>{
    const { error } = validatePostUrl(req.body);
    if (error) return res.status(400).send(error);


    let shorturlkey = null;
    if(req.body.shorturlkey) {
        const isExistKey = await Url.findOne({ shorturlkey: req.body.shorturlkey}).select('_id');
        if(isExistKey) return res.status(400).send(`The url with the given shorturlkey already exist,
         please choose another key or send empty key and let us to generate unique key for your url.`);
        
         shorturlkey = req.body.shorturlkey
    }

    let url = shorturlkey == null 
    ? new Url ({
        url: req.body.url,
        user: req.user._id
    }) 
    : new Url ({
        url: req.body.url,
        shorturlkey: shorturlkey,
        user: req.user._id
    });

    url = await url.save();
    res.send(url);
});


router.put('/:id', [auth, validateObjectId], async (req,res) =>{

    const { error } = validatePutUrl(req.body);
    if (error) return res.status(400).send(error);

    const url = await Url.findOneAndUpdate({ user: req.user._id, _id: req.params.id},{
        $set:{
            url: req.body.url,
        }
    }, { new: true }); // Optionally: get the updated document

    if(!url) return res.status(404).send('The url with the given ID was not found');

    res.send(url);
})

router.delete('/:id', [auth, validateObjectId] , async (req,res)=>{
    const url = await Url.findOneAndRemove({ user: req.user._id, _id: req.params.id});
    if(!url) return res.status(404).send('The url with the given ID was not found');
    
    res.send(url);
})

function validatePostUrl(url){
    const schema = {
        url: Joi.string().min(5).max(255).required(),
        shorturlkey: Joi.string().empty("").min(5).max(10),
    }

    return schema.validate(url);
}

function validatePutUrl(url){
    const schema = Joi.object({
        url: Joi.string().min(5).max(255).required()
    })

    return schema.validate(url);
}

module.exports = router;