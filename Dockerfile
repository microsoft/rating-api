#FROM nodejs:10
FROM registry.access.redhat.com/ubi8/nodejs-10
WORKDIR /10/test/test-app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
