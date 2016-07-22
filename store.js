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

//匹配时间的正则 ^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$

fs.readFile('jumu.csv', function (err, data) {
    if (err) {
        console.log("读取失败")
    }
    let objs = data.toString().split('\n')
    let items = []
    objs.map(function (e) {
        let value = e.split('\t')
        let item = {}

        // 研究id
        item.targetId = value[0]

        // 研究剧目名
        item.targetName = value[1]

        // 豆瓣url
        item.doubanUrl = value[2]

        // 类型
        if (value[0] >= 1000 && value[0] < 2000) {
            item.category = 1
        } else if (value[0] >= 2000 && value[0] < 3000) {
            item.category = 2
        } else if (value[0] >= 3000 && value[0] < 4000) {
            item.category = 3
        } else if (value[0] >= 4000 && value[0] < 5000) {
            item.category = 4
        } else if (value[0] >= 5000 && value[0] < 6000) {
            item.category = 5
        } else {
            item.category = 6
        }

        // 关键词处理

        item.keywords = []
        value.splice(3).map(function (e) {
            if (e) {
                item.keywords.push(e.split('+'))
                // console.log(e.split("+"))
            }
        })
        items.push(item)
        // console.log(item)
    })

    console.log(items)

    items.forEach(function (item) {
        Jumu.findOne({url:item.doubanUrl,name:item.targetName},function (err,result) {
            let objectId = result._id
            let name = result.name.split('\t')[0]
            let doubanId = result.url.split('/')[-1]
            let targetId = item.targetId
            let keywords = item.keywords
            let doubanTags = result.tags
            let moviePic = result.moviePic
            let year = result.year.match("/（(.*)）/")
            let doubanTypes = result.types
            let releaseDate =[]
            result.releaseDate.map(function(e){
                
                let date = e.time.match("/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/")
                let addr = e.time.match("/(.*)/")
                releaseDate.push({date:date,addr:addr})
            })
            let duration = result.runtime
            let rank = result.average
            let rankCount = result.people
            let betterThan = result.betterThan
            let intro = result.synopsis
            let stars = result.stars
            let pics = result.pics
            let awards = result.awards 
            let film = {
                objectId:objectId,
                doubanId:doubanId,
                name:name,
                targetId : targetId,
                category:category,
                keywords:keywords,
                doubanTags:doubanTags,
                moviePic:moviePic,
                year:year,
                doubanTypes:doubanTypes,
                releaseDate:releaseDate,
                duration:duration,
                rank:rank,
                rankCount:rank,
                betterThan:betterThan,
                intro:intro,
                stars:stars,
                pics:pics,
                awards:awards
            }
            console.log(film)
        })
    })
})