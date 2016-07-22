var mongoose = require('mongoose')
var schema = mongoose.Schema

var jumuMovie = new schema({
    istarget:Boolean, //是否为研究需要剧目,如果是true,否则false
    url:String, // 豆瓣url
    name:String, //豆瓣名字
    target_id: String, //研究文件id
    target_name: String, //研究文件name
    key_words: String, //研究关键字
    tags: Array, // 豆瓣成员常用的标签
    moviePic: String, //豆瓣头像url
    year: String, //年份
    directors: Array, //导演
    screenwriters: Array, //编剧
    actors: Array, //演员
    types: Array, //类型
    releaseDate: Array, //发布时间
    runtime: Array, //电影时长
    average: Number, //平均得分
    people: Number, //评分人数
    betterThan: Array, //好于同类百分比
    synopsis: String, //简介
    stars: Array, //得分分数分布
    longcomments:Array, //影评
    shortcomments:Array,//短评
    pics:[], //图片
    awards:[], //获奖情况
})
mongoose.connect('mongodb://localhost/tarantula')
module.exports = mongoose.model('jumu2', jumuMovie)
