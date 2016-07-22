var mongoose = require('mongoose')
var schema = mongoose.Schema

var DoubanReview = new schema({
    objectId :String,// film表中该剧目的_id
    title:String, // 影评名
    authorName :String,//作者名字
    authorUrl:String, //作者url
    authorImg:String, // 作者头像地址
    date :Date, // 影评发表日期
    content:String, // 内容
    grade:String, // 对剧目的评价 eg. 推荐,一般
    agree:Number, // 赞同人数
    disagree:Number //反对人数
})
mongoose.createConnection('mongodb://localhost/tarantula')
module.exports = mongoose.model('doubanReview', DoubanReview)