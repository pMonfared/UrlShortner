
const request = require('supertest');
const { User } = require('../../../models/user');
const { Url } = require('../../../models/url');

let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../../index');})
    afterEach(async () => { 
        await Url.remove({});
        await User.remove({});
        await server.close();
     });

    let token;
    let userid;
    let user;
    const exec = () => {
       return request(server)
       .post('/api/urls')
       .set('x-auth-token',token)
       .send({
            url: 'http://google.com',
            shorturlkey: 'sscres'
          })
    }

    beforeEach(async () => { 
        user = new User(
            {
              username:'pomon',
              email:'poriya.monfared@gmail.com',
              password:'123456'
            }
          )
          user = await user.save();
          userid = user._id;
        token = user.generateAuthToken();
    })

    
    it('should return 200 if token is valid', async () => {
        const res = await exec();
        
        expect(res.status).toBe(200);
    })

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();
        
        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();
        
        expect(res.status).toBe(400);
    })

});