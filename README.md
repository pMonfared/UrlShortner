# UrlShortner

This is a RESTfulAPI app by Nodejs ([express framework](https://github.com/expressjs/express))

### What you need to run?

* Install lastest LTS version of [NodeJs](http://nodejs.org) and [MongoDb](https://www.mongodb.com/download-center/community)
* Open cmd from project root on your os (win - mac - linux) and run:

```javascript
npm install
```

### You need to install some packages globally on your os like:

nodemon for run-watching mode development
```javascript
npm i -g nodemon 
```

because those are tools not a dependency for the project

```javascript
jest
jest-cli
supertest
dotenv
artillery
cross-env
```
#### 1- [jest](https://github.com/facebook/jest)
* This package use for unit-test
#### 2- [supertest](https://github.com/visionmedia/supertest)
* intergration-test
#### 3- [dotenv](https://github.com/motdotla/dotenv)
* .env file for our Environment variables as we need
#### 4- [artillery](https://artillery.io/)
* test-stress (benchmark)
#### 5- [cross-env](https://github.com/kentcdodds/cross-env)
* cross to different NODE_ENV=dev or prod or test



## You can run the project in 3 way:

```javascript
npm start
npm start-dev
npm start-prod
```
  
Or run only
 ```javascript
 node index.js
 ```

I use [config](https://www.npmjs.com/package/config) to manage some keys:

```
{
    "name":"Url Shorter",
    "db":"mongodb://localhost/UrlShorter_db",
    "jwtPrivateKey": "12345",
    "shorturlkeyCharacterCount":5
}
```

You can run all unit and integration test with below command:
 ```javascript
npm test
 ```

You can run test-stress and get the report with below command:
 ```javascript
npm test-stress
 ```

 It's the test-stress report:
 ```
All virtual users finished
Summary report @ 23:46:47(+0430) 2020-04-12
  Scenarios launched:  2400
  Scenarios completed: 2400
  Requests completed:  7200
  Mean response/sec: 119.13
  Response time (msec):
    min: 2.4
    max: 52.9
    median: 3.8
    p95: 14.3
    p99: 20.5
  Scenario counts:
    0: 2400 (100%)
  Codes:
    200: 4800
    302: 2400
 ```




 ### Enjoyed!



