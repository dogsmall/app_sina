'use strict';
var request = require('request').defaults({
    jar: true
})
var cheerio = require('cheerio')
var fs = require('fs')
var async = require('async')
var Jumu = require('./models/jumu.js')
var DoubanActors = require('./models/doubanActors.js')
var DoubanComments = require('./models/doubanComments.js')
var DoubanReview = require('./models/doubanReview.js')
var Film = require('./models/film.js')
var crypto = require('crypto')
//crypto.createHash('md5').update(name+doubanId).digest('hex')
//匹配时间的正则 ^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$

fs.readFile('test.csv', function (err, data) {
    if (err) {
        console.log("读取失败")
    }
    let objs = data.toString().split('\n')
    let items = []
    objs.map(function (e) {
        let value = e.split('\t')
        let item = {}
        // 研究剧目名
        item.targetName = value[1]

        // 豆瓣url
        item.doubanUrl = value[2]

        // 类型
        item.category = value[0]
        // 关键词处理

        item.keywords = []
        value.splice(3).map(function (e) {
            if (e) {
                item.keywords.push(e.split('+'))
            }
        })
        items.push(item)
    })

    items.forEach(function (item) {
        // console.log(item)
        Jumu.findOne({ category: item.category, target_name: item.targetName }, function (err, result) {
            if (err) {
                console.log(err)
            }
            if (result) {
                // console.log(result)
                let _Id = result._id
                let name = result.target_name
                let doubanId = result.url.split('/')[4]
                // let targetId = item.targetId
                let keywords = item.keywords
                let category = item.category
                let doubanTags = result.tags
                let moviePic = result.moviePic
                let year = parseInt(result.year.substring(1, 5))
                let doubanTypes = result.types
                let releaseDate = []
                result.releaseDate.map(function (e) {
                    // console.log(e.time.substring(0, 10))
                    let date = (e.time.substring(0, 10) !== "") ? Date(e.time.substring(0, 10)) : -1
                    let addr = e.time.substring(10)
                    releaseDate.push({ date: date, addr: addr })
                })
                // console.log(releaseDate)
                let duration = result.runtime !== "" ? parseInt(result.runtime) : -1
                let rank = result.average
                let rankCount = result.people
                let betterThan = result.betterThan
                let intro = result.synopsis
                let stars = result.stars
                let pics = result.pics
                let awards = result.awards
                let screenwriterIds = []
                result.screenwriters.forEach(function (e) {
                    let id = crypto.createHash('md5').update(e.name + e.name_id).digest('hex')
                    screenwriterIds.push(id)
                });
                let directorIds = []
                result.directors.forEach(function (e) {
                    let id = crypto.createHash('md5').update(e.name + e.name_id).digest('hex')
                    directorIds.push(id)
                })
                let artistIds = []
                result.actors.forEach(function (e) {
                    let id = crypto.createHash('md5').update(e.name + e.name_id).digest('hex')
                    artistIds.push(id)
                })
                let film = {
                    _id: _Id,
                    doubanId: doubanId,
                    name: name,
                    category: category,
                    keywords: keywords,
                    directorIds: directorIds, //导演 #i
                    screenwriterIds: screenwriterIds, //编剧 #i
                    artistIds: artistIds, //演员 #i   
                    doubanTags: doubanTags,
                    moviePic: moviePic,
                    year: year,
                    doubanTypes: doubanTypes,
                    releaseDate: releaseDate,
                    duration: duration,
                    rank: rank,
                    rankCount: rank,
                    betterThan: betterThan,
                    intro: intro,
                    stars: stars,
                    pics: pics,
                    awards: awards
                }
                // console.log(film)
                Film.create(film, function (err) {
                    if (err) {
                        console.log(err)
                    }
                })
                result.longcomments.map(function (e) {
                    let review = {
                        filmId: _Id,// film表中该剧目的_id
                        title: e.title, // 影评名
                        authorName: e.author.name,//作者名字
                        authorUrl: e.author.url, //作者url
                        authorImg: e.author.imgurl, // 作者头像地址
                        date: (e.time !== "") ? Date(e.time) : -1, // 影评发表日期
                        content: e.content, // 内容
                        grade: e.grade, // 对剧目的评价 eg. 推荐,一般
                        agree: e.agree !== "" ? parseInt(e.agree) : -1, // 赞同人数
                        disagree: e.disagree !== "" ? parseInt(e.disagree) : -1 //反对人数
                    }
                    // console.log(review)
                    DoubanReview.create(review, function (err) {
                        if (err) {
                            console.log(err)
                        }
                    })
                })

                result.shortcomments.map(function (e) {
                    let comment = {
                        filmId: _Id,// film表中该剧目的_id
                        authorName: e.name,// 发表评论的作者名
                        authorUrl: e.nameurl,// 作者的地址
                        authorImg: e.picurl, // 作者的头像地址
                        date: (e.time !== "") ? Date(e.time) : -1,// 发表时间
                        content: e.content,// 评论内容
                        grade: e.grade, //对电影的等级评价 eg. 一般 推荐 极差
                        agree: e.agree !== "" ? parseInt(e.agree) : -1, //赞同人数
                    }
                    // console.log(comment)
                    DoubanComments.create(comment, function (err) {
                        if (err) {
                            console.log(err)
                        }
                    })
                })
                result.directors.concat(result.screenwriters, result.actors)
                result.directors.forEach(function (e) {
                    let actor = {
                        _id: crypto.createHash('md5').update(e.name + e.name_id).digest('hex'),
                        doubanId: e.name_id,
                        name: e.name
                    }
                    DoubanActors.create(actor, function (err) {
                        if (err) {
                            console.log(err)
                        }
                        console.log("演员已保存")
                    })
                });
            } else {
                console.log(item.doubanUrl)
                console.log(item.targetName)
                console.log("没有找到剧目")
            }

        })
    })
})