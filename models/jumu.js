var mongoose = require('mongoose')
var schema = mongoose.Schema

var jumuMovie = new schema({
    key_id: String, //研究文件id
    movie_name: String, //研究文件name
    key_words: String, //研究关键字
    tags: Array, // 豆瓣成员常用的标签
    douban_url: String, //豆瓣url
    douban_name: String, //豆瓣的name
    moviePic: String, //豆瓣头像url
    years: String, //年份
    director: Array, //导演
    screenwriter: Array, //编剧
    actor: Array, //演员
    type: Array, //类型
    releaseDate: Array, //发布时间
    runtime: Array, //电影时长
    average: Number, //平均得分
    people: Number, //评分人数
    betterThan: Array, //好于同类百分比
    synopsis: String, //简介
    stars: Array //得分分数分布
})
mongoose.connect('mongodb://localhost/tarantula')
module.exports = mongoose.model('jumu', jumuMovie)
