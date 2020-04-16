const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');
const { Url } = require('../models/url')
const { UrlActivity } = require('../models/urlActivity')
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const moment = require('moment');


router.get('/:id',[auth], async (req,res) => {
    const { error } = validateGet(req.query);
    if (error) return res.status(400).send(error);

    const url = await findUrl({id: req.params.id, userId: req.user._id})
    if(!url) return res.status(404).send('The url with the given shorturlkey/id was not found');

    const query = generateUrlActivityQuery({
        timeInterval:req.query.timeInterval,
        category:req.query.category,
        browser:req.query.browser,
        urlId:url._id
    })

    const urlActivities = await UrlActivity
    .find(query)
    .select('-url -__v');

    const views = Object.keys(urlActivities).length;
    const distincViewsbyIp = [...new Set(urlActivities.map(x => x.ip))];
    const users = Object.keys(distincViewsbyIp).length;

    res.send({views, users})
});


async function findUrl({ id, userId }){
    if(!mongoose.Types.ObjectId.isValid(userId))
      throw new Error('userId is invalid.');
    
    const query = mongoose.Types.ObjectId.isValid(id)
    ? { user: userId, _id: id }
    : { user: userId, shorturlkey: id };

    return await Url.findOne(query).select('_id');
}

function generateUrlActivityQuery({ timeInterval, urlId, category, browser }){
    if(!mongoose.Types.ObjectId.isValid(urlId))
    throw new Error('urlId is invalid.');

    let queryUrlActivities = {'url': urlId };

    if(category)
      queryUrlActivities.category = category;

    if(browser)
    {
        var regexpBrowser = new RegExp("^"+ browser);
        queryUrlActivities.browser = regexpBrowser;
    }

    switch (timeInterval) {
        case 'today':
            {
                const today = moment().startOf('day');
                queryUrlActivities.activityDateTime = {
                    $gte: moment(today).startOf('day').toDate(),
                    $lte: Date.now(),
                  }
            }
            break;
        case 'yesterday':
            {
                const yesterday = moment().subtract(1, 'days');

                // console.log('yesterdayBegin:',yesterday.startOf('day').toDate())
                // console.log('yesterdayEnd:',yesterday.endOf('day').toDate())

                queryUrlActivities.activityDateTime = {
                    $gte: moment(yesterday).startOf('day').toDate(),
                    $lte: moment(yesterday).endOf('day').toDate(),
                  }
            }
            break;
        case 'lastweek':
            {
                const startdayoflast7days = moment().subtract(7, 'days');
                const yesterday = moment().subtract(1, 'days');

                // console.log('lastweekBegin:',startdayoflast7days.startOf('day').toDate())
                // console.log('lastweekEnd:',yesterday.endOf('day').toDate())

                queryUrlActivities.activityDateTime = {
                    $gte: startdayoflast7days.startOf('day').toDate(),
                    $lte: yesterday.endOf('day').toDate(),
                  }
            }
            break;
        case 'lastmonth':
            {
                const startdayoflast30days = moment().subtract(1, 'month');
                const yesterday = moment().subtract(1, 'days');

                // console.log('lastMonthBegin:',startdayoflast30days.startOf('day').toDate())
                // console.log('lastMonthEnd:',yesterday.endOf('day').toDate())

                queryUrlActivities.activityDateTime = {
                    $gte: startdayoflast30days.startOf('day').toDate(),
                    $lte: yesterday.endOf('day').toDate(),
                  }
            }
            break;
        default:
            break;
    }

    return queryUrlActivities;
}

function validateGet(url){
    const schema = Joi.object({
        category: Joi.string().empty(""),//mobile,desktop
        browser: Joi.string().empty(""),//chrome,firefox
        timeInterval: Joi.string().empty(""),//today,yesterday,week,month
    });
    return schema.validate(url);
}



module.exports = router;