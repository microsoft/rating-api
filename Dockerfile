FROM registry.access.redhat.com/ubi8/nodejs-10
WORKDIR /10/app/
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
