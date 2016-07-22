var mongoose = require('mongoose')
var schema = mongoose.Schema

var Doubanactors = new schema({
    doubanId :String,
    name:String, 
})
mongoose.connect('mongodb://localhost/film')
module.exports = mongoose.model('doubanActors', Doubanactors)