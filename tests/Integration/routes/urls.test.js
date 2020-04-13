const request = require('supertest');
const { Url } = require('../../../models/url');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/urls', () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(async () => { 
        await Url.remove({});
        await User.remove({});
        await server.close();
    });

    describe('GET /', () => {
        let token;
        let userid;

        const exec = async () => {
          return await request(server)
             .get('/api/urls/')
             .set('x-auth-token',token);
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
          token = user.generateAuthToken();
        });

        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });

        it('should return all urls', async () => { 
          
            await Url.collection.insertMany([
                {
                  url: "http://google.com",
                  shorturlkey:"abcde",
                  user: userid
                },
                {
                  url: "http://yahoo.com",
                  shorturlkey:"abcdf",
                  user: userid
                }
            ])

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=> g.url == 'http://google.com')).toBeTruthy();
            expect(res.body.some(g=> g.url == 'http://yahoo.com')).toBeTruthy();
        });
    });

    describe('GET /:id', () => { 
      let token;
      let userid;
      let id;

      const exec = async () => {
        return await request(server)
           .get('/api/urls/' + id)
           .set('x-auth-token',token);
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
        token = user.generateAuthToken();
      });


      it('should return 401 if client is not logged in', async () => {
        token = ''; 
        id = '1';
  
        const res = await exec();
  
        expect(res.status).toBe(401);
      });

       it('should return a url if valid id is passed', async () => {
           const url = new Url({
            url: "http://google.com",
            shorturlkey:"abcde",
            user:userid
           });
           await url.save();

           id = url._id;
  
           const res = await exec();

           expect(res.status).toBe(200);
           expect(res.body).toHaveProperty('url', url.url);
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

    });

    describe('POST /', () => {
        
        let token;
        let url;
        let shorturlkey = "";
        let userid;
        const exec = async () => {
            return await request(server)
               .post('/api/urls')
               .set('x-auth-token',token)
               .send({
                url,
                shorturlkey
              });
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
         token = user.generateAuthToken();
            url = 'http://google.com'
        })
 

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if url is less than 5 characters', async () => {
            url = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if url is more than 255 characters', async () => {
            url = new Array(260).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if shorturlkey is less than 5 characters', async () => {
          url = 'http://google.com';
          shorturlkey = 'avc';

          const res = await exec();

          expect(res.status).toBe(400);
      });

      it('should return 400 if shorturlkey is more than 10 characters', async () => {
          url = 'http://google.com';
          shorturlkey = new Array(60).join('a');

          const res = await exec();

          expect(res.status).toBe(400);
      });

        it('should return 400 if shorturlkey is duplicated', async () => {
        
        const urlcreate = new Url({
          url: "http://google.com",
          shorturlkey:"abcde",
          user:userid
         });
        await urlcreate.save();

        url = urlcreate.url;
        shorturlkey = urlcreate.shorturlkey;

        const res = await exec();

        expect(res.status).toBe(400);
        });

        it('should save the url without empty shorturlkey if it is valid', async () => {
          shorturlkey = "jjjsdw";
          const res = await exec();

          expect(res.status).toBe(200);
          const url = await Url.find({ url: 'http://google.com'});
          expect(url).not.toBeNull();
      });

        it('should save the url with empty shorturlkey if it is valid', async () => {
            shorturlkey = "";
            const res = await exec();

            expect(res.status).toBe(200);
            const url = await Url.find({ url: 'http://google.com'});
            expect(url).not.toBeNull();
        });

        it('should retrun the url if it is valid', async () => {
            shorturlkey = "";
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('url', 'http://google.com');
        });
    });

    describe('PUT /', () => {
        let token;
        let newUrl;
        let url;
        let id;
        let userid;
        const exec = async () => {
            return await request(server)
               .put('/api/urls/' + id)
               .set('x-auth-token',token)
               .send({
                url: newUrl
              });
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
             // Before each test we need to create a url and 
             // put it in the database.      
             url = new Url({
                    url: 'http://google.com',
                    shorturlkey:'abced',
                    user:userid
                  });

             await url.save();
            
            
            token = user.generateAuthToken();
            id = url._id;
            newUrl = 'http://yahoo.com'; 
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''; 
      
            const res = await exec();
      
            expect(res.status).toBe(401);
          });
      
          it('should return 400 if url is less than 5 characters', async () => {
            newUrl = '1234'; 
            
            const res = await exec();
      
            expect(res.status).toBe(400);
          });
      
          it('should return 400 if url is more than 50 characters', async () => {
            newUrl = new Array(260).join('a');
      
            const res = await exec();
      
            expect(res.status).toBe(400);
          });
      
          it('should return 404 if id is invalid', async () => {
            id = 1;
      
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should return 404 if url with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
      
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should update the url if input is valid', async () => {
            await exec();
      
            const updatedUrl = await Url.findById(url._id);
      
            expect(updatedUrl.url).toBe(newUrl);
          });
      
          it('should return the updated url if it is valid', async () => {
            const res = await exec();
      
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('url', newUrl);
          });
    })

    describe('DELETE /:id', () => {
        let token;
        let url;
        let id; 
        let userid;
        const exec = async () => {
            return await request(server)
               .delete('/api/urls/' + id)
               .set('x-auth-token',token)
               .send();
        }

        beforeEach(async () => { 
            let user = new User(
              {
                username:'pomon',
                email:'poriya.monfared@gmail.com',
                password:'123456',
                isAdmin: true
              }
            )
            user = await user.save();
            userid = user._id;
             // Before each test we need to create a url and 
             // put it in the database.      
            url = new Url({
                    url: 'http://google.com',
                    shorturlkey:'abced',
                    user:userid
                  });

            await url.save();
            
            
            token = user.generateAuthToken(); 
            id = url._id;
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''; 
      
            const res = await exec();
      
            expect(res.status).toBe(401);
          });
      
          // it('should return 403 if the user is not an admin', async () => {
          //   token = new User({ isAdmin: false }).generateAuthToken(); 
      
          //   const res = await exec();
      
          //   expect(res.status).toBe(403);
          // });
      
          it('should return 404 if id is invalid', async () => {
            id = 1; 
            
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should return 404 if no url with the given id was found', async () => {
            id = mongoose.Types.ObjectId();
      
            const res = await exec();
      
            expect(res.status).toBe(404);
          });
      
          it('should delete the url if input is valid', async () => {
            await exec();
      
            const urlInDb = await Url.findById(id);
      
            expect(urlInDb).toBeNull();
          });
      
          it('should return the removed url', async () => {
            const res = await exec();
      
            expect(res.body).toHaveProperty('_id', url._id.toHexString());
            expect(res.body).toHaveProperty('url', url.url);
          });

    })
});