'use strict';

var jsdom = require("jsdom");
var fs = require("fs");
var path = require('path')
var jquery = fs.readFileSync(path.join(__dirname, "./jquery.js"), "utf-8");

var request = require('request').defaults({
    jar: true
})
var cheerio = require('cheerio')
var Douban = require('./models/douban.js')
var async = require('async');

//获取电影id
var options = {
    tags: 2016,
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
    }
}
options.url = "https://movie.douban.com/tag/" + options.tags + "?start=2620&type=T"



/**
 * 通过tag年份,来获取想要的电影id
 *
 */
function getMovieId(options) {
    let obj = options
        // let idlist = ids
    setTimeout(function() {
        console.log(obj.url)
        request(obj, function(err, data) {
            if (err) {
                console.log(err)
            }
            let $ = cheerio.load(data.body)
            let arr = Array.from($("div[id^='collect_form_']"));
            async.waterfall([
                    function(cb) {
                        let ids = []
                        let arr = Array.from($("div[id^='collect_form_']"));
                        for (let value of arr) {
                            ids.push(value.attribs.id.split('_')[2])
                        }
                        cb(null, ids)
                    },
                    function(ids, cb) {
                        for (let i = 0; i < ids.length; i++) {
                            setTimeout(function() {
                                jsdom.env({
                                    url: "https://movie.douban.com/subject/" + ids[i],
                                    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/48.0.2564.82 Chrome/48.0.2564.82 Safari/537.36',
                                    src: [jquery],
                                    done: function(err, window) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        // console.log(window)
                                        let $ = window.$;
                                        // console.log($('#content > h1 > span[property="v:itemreviewed"]').text().split(' ')[0])
                                        let movie = {
                                            // 豆瓣地址
                                            url: "https://movie.douban.com/subject/" + ids[i],
                                            // 中文名
                                            name: $('#content > h1 > span[property="v:itemreviewed"]').text().split(' ')[0],
                                            // 外文名
                                            otherName: $('#content > h1 > span[property="v:itemreviewed"]').text().replace($('#content > h1 > span[property="v:itemreviewed"]').text().split(' ')[0], ""),
                                            // 海报头像
                                            moviePic: $("#mainpic > a > img").attr('src'),
                                            // 分类年份
                                            tag: $('#content > h1 > span.year').text(),
                                            // 导演
                                            director: (function() {
                                                var results = [];
                                                for (let value of $('span.attrs>a[rel="v:directedBy"]')) {
                                                    results.push({
                                                        name: value.text,
                                                        name_id: value.href.split('/')[4]
                                                    })
                                                }
                                                return results
                                            })(),
                                            // 编剧
                                            screenwriter: (function() {
                                                var results = []
                                                for (let value of $('#info > span:nth-child(3) > span:nth-child(2)>a')) {
                                                    // console.log(value)
                                                    results.push({
                                                        name: value.text,
                                                        name_id: value.href.split('/')[4]
                                                    })
                                                }

                                                return results
                                            })(),
                                            // 演员
                                            actor: (function() {
                                                var results = [];
                                                // console.log($('#info > span.actor > span.attrs>a'))
                                                for (let value of $('#info > span.actor > span.attrs>a')) {
                                                    results.push({
                                                        name: value.text,
                                                        name_id: value.href.split('/')[4]
                                                    })
                                                }
                                                return results
                                            })(),
                                            // 类型
                                            type: (function() {
                                                var results = [];
                                                for (let value of $('#info>span[property = "v:genre"]')) {
                                                    results.push({
                                                        tag: value.firstChild.nodeValue
                                                    })
                                                }
                                                return results
                                            })(),
                                            // 放映时间
                                            releaseDate: (function() {
                                                var results = [];
                                                for (let value of $('#info > span[property="v:initialReleaseDate"]')) {
                                                    // console.log(value);
                                                    results.push({
                                                        time: value.firstChild.nodeValue
                                                    })
                                                }
                                                return results
                                            })(),
                                            // 时长
                                            runtime: $('#info>span[property="v:runtime"]').text(),
                                            // 豆瓣评分
                                            average: $('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > strong').text(),
                                            // 评分人数
                                            people: $('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > div > div.rating_sum > a > span').text(),
                                            // 好于
                                            betterThan: (function() {
                                                var results = [];
                                                for (let value of $('#interest_sectl > div.rating_betterthan > a')) {
                                                    // console.log(value.text)
                                                    results.push({
                                                        better: value.text
                                                    })
                                                }
                                                return results
                                            })(),
                                            // 简介
                                            synopsis: $('#link-report > span').eq(-2).text().trim(),
                                            stars: {
                                                stars5: $('span.stars5').next().next().text().trim(),
                                                stars4: $('span.stars4').next().next().text().trim(),
                                                stars3: $('span.stars3').next().next().text().trim(),
                                                stars2: $('span.stars2').next().next().text().trim(),
                                                stars1: $('span.stars1').next().next().text().trim(),
                                            }

                                        }
                                        var data = fs.readFileSync('jumu.csv');
                                        let objs = data.toString().split('\n')


                                        if (movie.url == ) {

                                        }
                                        // console.log(movie)
                                        //store
                                        var _movie
                                        _movie = new Douban(movie)
                                        _movie.save(function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log('douban save suc.')
                                            }
                                        })
                                    }
                                })
                            }, i * 1000)
                        }
                        let options = obj
                        cb(null, options)
                    },
                    function(options, cb) {
                        if ($('span.next > a').attr('href')) {
                            let obj = options
                            obj.url = $("span.next > a").attr('href')
                            console.log("开始下一页")
                            return getMovieId(obj)
                        } else {
                            console.log("开始下一年")
                            if (options.tags < 2009) {
                                console.log('年份加一')
                                options.tags = options.tags + 1
                                options.url = "https://movie.douban.com/tag/" + options.tags + "?start=0&type=T"
                                    // console.log(options)
                                return getMovieId(options)
                            } else {
                                console.log("完成!")
                            }
                        }
                        cb(null, "Done!")
                    }

                ],
                function(err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                })
        })

    }, 30000)
}
getMovieId(options)
    /**
     *获取到 电影或电视剧的中文名,外文名,导演,编剧,主演,类型,上映日期,片长,豆瓣评分,评分人数,优于同类型
     *
     *新增头像,星级百分比
     *
     *遗漏了制片国家地区,语言,又名,IMDb链接
     *
     */
    // function movieInfo(mov_id) {
    //
    // }
