var mongoose = require('mongoose');

var itemchema = new mongoose.Schema({
    uid: Number,
    name: String,
    img: String,
    description: String,
    aliases: String
});

mongoose.model('Item', itemSchema, 'items');