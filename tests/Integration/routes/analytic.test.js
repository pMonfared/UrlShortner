const request = require('supertest');
const { Url } = require('../../../models/url');
const { User } = require('../../../models/user');
const { UrlActivity } = require('../../../models/urlActivity');
const moment = require('moment');

const mongoose = require('mongoose');
let server;

describe('/api/analytic', () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(async () => { 
        await Url.remove({});
        await User.remove({});
        await server.close();
    });


    describe('GET /:id', () => { 
        let token;
        let userid;
        let id;
        let id2;
        let url;
        let urlActivities = [];
        let categoryfilter = "";
        let browserfilter = "";
        let intervalfilter = "";

        let allviews = 0;
        let userviews = 0;
  
        const exec = async () => {
          return await request(server)
             .get('/api/analytic/' + id +`?category=${categoryfilter}&browser=${browserfilter}&timeInterval=${intervalfilter}`)
             .set('x-auth-token', token);
        }
  
        beforeEach(async () => {
          let user = new User(
             {
              username:'pomon',
              email:'poriya.monfared@gmail.com',
              password:'123456'
             }
          )
          user = await user.save();
          userid = user._id;

          url = new Url({
            url: "http://google.com",
            shorturlkey:"abcde",
            user:userid
           });
           await url.save();

           const url2 = new Url({
            url: "http://google.com",
            shorturlkey:"abcda",
            user:userid
           });
           await url2.save();

           id = url._id;
           id2 = url2._id;

           urlActivities = [
            {
                 category: 'mobile',
                 browser: 'chrome',
                 ip: '5.24.247.12',
                 url: id,
                 activityDateTime: moment().toDate()
            },
            {
                category: 'mobile',
                browser: 'firefox',
                ip: '5.27.247.12',
                url: id,
                activityDateTime: moment().toDate()
            },
            {
                 category: 'desktop',
                 browser: 'chrome',
                 ip: '5.24.247.12',
                 url: id,
                 activityDateTime: moment().toDate()
            },
            {
                 category: 'mobile',
                 browser: 'firefox',
                 ip: '5.24.247.13',
                 url: id,
                 activityDateTime: moment().subtract(1, 'days').startOf('day').toDate()
            },
            {
                 category: 'desktop',
                 browser: 'firefox',
                 ip: '5.24.247.14',
                 url: id,
                 activityDateTime: moment().subtract(5, 'days').startOf('day').toDate()
            },
            {
                 category: 'desktop',
                 browser: 'safari',
                 ip: '6.24.247.14',
                 url: id,
                 activityDateTime: moment().subtract(25, 'days').startOf('day').toDate()
            },
            {
                 category: 'desktop',
                 browser: 'safari',
                 ip: '5.24.247.24',
                 url: id,
                 activityDateTime: moment().subtract(20, 'days').startOf('day').toDate()
            },
            {
                 category: 'desktop',
                 browser: 'safari',
                 ip: '6.24.247.24',
                 url: id,
                 activityDateTime: moment().subtract(40, 'days').startOf('day').toDate()
            },
            {
                 category: 'mobile',
                 browser: 'opera',
                 ip: '6.24.235.24',
                 url: id,
                 activityDateTime: moment().subtract(1, 'days').startOf('day').toDate()
            }
         ];

           await UrlActivity.collection.insertMany(urlActivities)

           allviews = Object.keys(urlActivities).length;
           const distincViewsbyIp = [...new Set(urlActivities.map(x => x.ip))];
           userviews = Object.keys(distincViewsbyIp).length;

          token = user.generateAuthToken();
        });
  
  
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
          id = '1';
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
  
         it('should return a object without any filter if valid id is passed', async () => {
    
             const res = await exec();
  
             expect(res.status).toBe(200);
             expect(res.body).toHaveProperty('views', allviews);
             expect(res.body).toHaveProperty('users', userviews);
         });

         it('should return a object filter by categoryfilter is desktop if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "desktop";
            browserfilter = "";
            
            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => x.url._id == id && x.category == categoryfilter))];

            let allcategoryviews = Object.keys(filteredUrlActivities).length;
            const distincCategoryViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let usercategoryviews = Object.keys(distincCategoryViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allcategoryviews);
            expect(res.body).toHaveProperty('users', usercategoryviews);
        });

        it('should return a object filter by categoryfilter is mobile if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "mobile";
            browserfilter = "";

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => x.url._id == id && x.category == categoryfilter))];
            
            let allcategoryviews = Object.keys(filteredUrlActivities).length;
            const distincCategoryViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let usercategoryviews = Object.keys(distincCategoryViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allcategoryviews);
            expect(res.body).toHaveProperty('users', usercategoryviews);
        });

        it('should return a object filter by browserfilter is chrome if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "";
            browserfilter = "chrome";

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => x.url._id == id && x.browser == browserfilter))];
            
            let allbrowserviews = Object.keys(filteredUrlActivities).length;
            const distincBrowserViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let userBrowserviews = Object.keys(distincBrowserViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allbrowserviews);
            expect(res.body).toHaveProperty('users', userBrowserviews);
        });

        it('should return a object filter by browserfilter is firefox if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "";
            browserfilter = "firefox";

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => x.url._id == id && x.browser == browserfilter))];
            
            let allbrowserviews = Object.keys(filteredUrlActivities).length;
            const distincBrowserViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let userBrowserviews = Object.keys(distincBrowserViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allbrowserviews);
            expect(res.body).toHaveProperty('users', userBrowserviews);
        });

        it('should return a object filter by intervalfilter is today if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "";
            browserfilter = "";
            intervalfilter = "today"
            const todayDateStartof = moment().startOf('day').toDate();

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => 
                x.url._id == id &&
                 (x.activityDateTime >= todayDateStartof && x.activityDateTime <= moment.now())
                 ))];

            let allbrowserviews = Object.keys(filteredUrlActivities).length;
            const distincBrowserViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let userBrowserviews = Object.keys(distincBrowserViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allbrowserviews);
            expect(res.body).toHaveProperty('users', userBrowserviews);
        });

        it('should return a object filter by intervalfilter is yesterday if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "";
            browserfilter = "";
            intervalfilter = "yesterday"

            const yesterday = moment().subtract(1, 'days');
            const startof = moment(yesterday).startOf('day').toDate();
            const endof = moment(yesterday).endOf('day').toDate();

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => 
                x.url._id == id &&
                 (x.activityDateTime >= startof && x.activityDateTime <= endof)
                 ))];

            let allbrowserviews = Object.keys(filteredUrlActivities).length;
            const distincBrowserViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let userBrowserviews = Object.keys(distincBrowserViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allbrowserviews);
            expect(res.body).toHaveProperty('users', userBrowserviews);
        });

        it('should return a object filter by intervalfilter is lastweek if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "";
            browserfilter = "";
            intervalfilter = "lastweek"

            const startdayoflast7days = moment().subtract(7, 'days');
            const yesterday = moment().subtract(1, 'days');

            const startof = startdayoflast7days.startOf('day').toDate();
            const endof = yesterday.endOf('day').toDate();

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => 
                x.url._id == id &&
                 (x.activityDateTime >= startof && x.activityDateTime <= endof)
                 ))];

            let allbrowserviews = Object.keys(filteredUrlActivities).length;
            const distincBrowserViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let userBrowserviews = Object.keys(distincBrowserViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allbrowserviews);
            expect(res.body).toHaveProperty('users', userBrowserviews);
        });

        it('should return a object filter by intervalfilter is lastmonth if valid id is passed', async () => {
            id = url._id;
            categoryfilter = "";
            browserfilter = "";
            intervalfilter = "lastmonth"

            const startdayoflast30days = moment().subtract(1, 'month');
            const yesterday = moment().subtract(1, 'days');


            const startof = startdayoflast30days.startOf('day').toDate();
            const endof = yesterday.endOf('day').toDate();

            const res = await exec();

            const filteredUrlActivities = [...new Set(urlActivities.filter(x => 
                x.url._id == id &&
                 (x.activityDateTime >= startof && x.activityDateTime <= endof)
                 ))];

            let allbrowserviews = Object.keys(filteredUrlActivities).length;
            const distincBrowserViewsbyIp = [...new Set(filteredUrlActivities.map(x => x.ip))];
            let userBrowserviews = Object.keys(distincBrowserViewsbyIp).length;
 
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', allbrowserviews);
            expect(res.body).toHaveProperty('users', userBrowserviews);
        });
  
         it('should return 404 if invalid id is passed', async () => {
           id = '1';
    
           const res = await exec();
  
           expect(res.status).toBe(404);
         });
  
         it('should return 404 if no url with the given id exist', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
  
          expect(res.status).toBe(404);
         });

         it('should return 400 if query params invalid', async () => {
            const res = await request(server)
            .get('/api/analytic/' + id2 + "?pop=1")
            .set('x-auth-token', token);
    
            expect(res.status).toBe(400);
         });

         it('should return an object with 0 values if url with the given id exist but have not any activity yet', async () => {
            const res = await request(server)
            .get('/api/analytic/' + id2)
            .set('x-auth-token', token);
    
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('views', 0);
            expect(res.body).toHaveProperty('users', 0);
         });
  
      });
});