require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./models/mongo/item');
require('./models/mongo/rate');
require('./models/mongo/site');

mongoose.Promise = global.Promise;
var connectOptions = { useMongoClient: true, autoIndex: false};

mongoose.connect(process.env.MONGODB_URI, connectOptions, function(error){
  if(!error){
    console.dir('CONNECTED TO ' + process.env.MONGODB_URI);
    
    var Rate = mongoose.model("Rate");
    var Item = mongoose.model("Item");
    var Site = mongoose.model("Site");

    // Check if the items are empty, insert mock data
    Item.find({}, function(err, items) {
      if(items.length == 0) {
        console.dir('No items found in the database. Loading data.');
        var itemsMock = require('./data/items.json');
        Item.collection.insertMany(itemsMock, function(err,r) {});
      } else {
        console.dir( items.length + ' items found in the database. Skipping loading data.');
      }
    });

    // Check if the items are empty, insert mock data
    Rate.count({}, function(err, c) {
      if(c == 0) {
        console.dir('No ratings found in the database. Loading data.');
        var ratingsMock = require('./data/ratings.json');
        Rate.collection.insertMany(ratingsMock, function(err,r) {});
      }
    });

    // Check if the items are empty, insert mock data
    Site.countDocuments({}, function(err, c) {
      if(c == 0) {
        console.dir('No sites found in the database. Loading data.');
        var sitesMock = require('./data/sites.json');
        Site.collection.insertMany(sitesMock, function(err,r) {});
      }
    });

  }
});

var mongo = require('./routes/mongo');
var index = require('./routes/index');

app.use('/', index);
app.use('/api', mongo);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
