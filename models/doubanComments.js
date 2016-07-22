var mongoose = require('mongoose')
var schema = mongoose.Schema

var doubanComments = new schema({
    objectId :String,// film表中该剧目的_id
    authorName :String,// 发表评论的作者名
    authorUrl:String,// 作者的地址
    authorImg:String, // 作者的头像地址
    date :Date,// 发表时间
    content:String,// 评论内容
    grade:String, //对电影的等级评价 eg. 一般 推荐 极差
    agree:Number, //赞同人数
})
mongoose.connect('mongodb://localhost/tarantula')
module.exports = mongoose.model('doubanComments', Doubancomments)