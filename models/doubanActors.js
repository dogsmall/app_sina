var mongoose = require('mongoose')
var schema = mongoose.Schema

var Doubanactors = new schema({
    doubanId :String,
    name:String, 
})
mongoose.createConnection('mongodb://localhost/tarantula')
module.exports = mongoose.model('doubanActors', Doubanactors)