const express = require('express');
const router = express.Router();
const { Url } = require('../models/url')
const { UrlActivity, validate } = require('../models/urlActivity')
const DeviceDetector = require("device-detector-js");

const MobileDetect = require('mobile-detect')


router.get('/:shorturlkey', async (req,res) => {
    if(!req.headers['user-agent']) return res.status(400).send('The url with the given user-agent can not be process');


    const url = await Url.findOne({ shorturlkey: req.params.shorturlkey}).select('_id url');
    if(!url) return res.status(404).send('The url with the given shorturlkey was not found');


    //log url Activity (Synchronous)
    logActivity({
            useragent: req.headers['user-agent'],
            urlId: url._id,
            ipAddress: req.connection.remoteAddress
        });

    res.redirect(url.url);
});

function logActivity({useragent, urlId, ipAddress}) {
    const deviceDetector = new DeviceDetector();
    const ua = deviceDetector.parse(useragent);
    const md = new MobileDetect(useragent);

    let urlActivity = new UrlActivity({
        category: md.mobile() ? 'mobile' :'desktop',
        browser: ua.client && ua.client.name ? ua.client.name.toLowerCase() : 'unrecognized',
        ip: ipAddress,
        url: urlId
    });

    urlActivity = urlActivity.save();
}

module.exports = router;