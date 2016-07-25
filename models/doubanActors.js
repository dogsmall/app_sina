var mongoose = require('mongoose')
var schema = mongoose.Schema

var Doubanactors = new schema({
    _id :String,
    doubanId :String,
    name:String, 
})
mongoose.createConnection('mongodb://localhost/gsw')
module.exports = mongoose.model('douban_artists', Doubanactors)