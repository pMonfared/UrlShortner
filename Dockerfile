FROM node:12.16.1
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
CMD node index.js
EXPOSE 8081