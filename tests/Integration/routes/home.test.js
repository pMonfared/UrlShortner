const request = require('supertest');
const { Url } = require('../../../models/url');
const { User } = require('../../../models/user');
const { UrlActivity } = require('../../../models/urlActivity');
const mongoose = require('mongoose');
let server;


describe('redirect short url', () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(async () => { 
        await Url.remove({});
        await User.remove({});
        await UrlActivity.remove({});
        await server.close();
    });

    describe('GET /', () => {
        let id;
        let userid;
        let useragent;
        const exec = async () => {
          return await request(server)
             .get('/'+ id)
             .set('User-Agent',useragent);
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
        });

        it('should return 400 if useragent is empty', async () => { 
            await Url.collection.insertMany([
                {
                  url: "http://google.com",
                  shorturlkey:"eerwew",
                  user: userid
                }
            ])

            id = "eerwew";
            useragent = "";

            const res = await exec();

            expect(res.status).toBe(400);
        });


        it('should return 404 if shorturlkey is empty', async () => { 
            id = "";
            useragent = "Mozilla/5.0 (Linux; Android 4.2.2; en-us; SAMSUNG GT-I9505 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19";

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if shorturlkey is invalid', async () => { 
            id = "1231";
            useragent = "Mozilla/5.0 (Linux; Android 4.2.2; en-us; SAMSUNG GT-I9505 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19";

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should redirect to full url is shorturlkey is valid', async () => { 
          
            await Url.collection.insertMany([
                {
                  url: "http://google.com",
                  shorturlkey:"xcccde",
                  user: userid
                },
                {
                  url: "http://yahoo.com",
                  shorturlkey:"wwwssd",
                  user: userid
                }
            ])

            id = "wwwssd";
            useragent = "PostmanRuntime/7.24.0"
            const res = await exec();

            expect(res.status).toBe(302);
        });
    });
});