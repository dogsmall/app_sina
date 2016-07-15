var mongoose = require('mongoose')
var schema = mongoose.Schema

var doubanMovie = new schema({

    movieId: String,
    name: String,
    otherName: String,
    moviePic: String,
    tag: String,
    director: Array,
    screenwriter: Array,
    actor: Array,
    type: Array,
    releaseDate: Array,
    runtime: Array,
    average: Number,
    people: Number,
    betterThan: Array,
    synopsis: String,
    stars: Array
})
mongoose.connect('mongodb://localhost/tarantula')
module.exports = mongoose.model('douban', doubanMovie)
