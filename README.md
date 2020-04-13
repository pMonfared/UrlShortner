# UrlShortner

This is a RESTfulAPI app by Nodejs (express framework)

### What you need to run?

* Install lastest LTS version of [NodeJs](http://nodejs.org) and [MongoDb](https://www.mongodb.com/download-center/community)
* Open cmd from project root on your os (win - mac - linux) and run:

```javascript
npm install
```

### You need install some packages globally on your os like:

nodemon for run-watching mode development
```javascript
npm i -g nodemon 
```

because those are tool not a dependency for project

```javascript
jest
jest-cli
supertest
dotenv
artillery
cross-env
```
#### 1- jest
* This package use for unit-test
#### 2- supertest
* intergration-test
#### 3- dotenv
* .env file for our Enviroment varibales as we need
#### 4- artillery
* test-stress (benchmark)
#### 5- cross-env
* cross to diffrent NODE_ENV=dev or prod or test



## You can run project 3 way:

```javascript
npm start
npm start-dev
npm start-prod
```
  
Or run only
 ```javascript
 node index.js
 ```