'use strict';

// var lineReader = require('line-reader');
var fs = require("fs");
var async = require('async')
var request = require('request').defaults({
    jar: true
})
var cheerio = require('cheerio')



// let list = []
// lineReader.eachLine('jumu.csv', function(line, last) {
//     // console.log(line.split('/t'))
//     let obj = line.split('/t')
//     list.push(obj)
//     return list
// });
// console.log(list)
/**
 * 爬取豆瓣上的内容
 * @param  {[type]} obj 是文件中的每一行
 * @return {[type]}     [description]
 */
function getinfo(obj) {
    // 将每一行变成一个数组
    let info = obj.split('\t')
    let url = info[2]
        //如果有豆瓣url,则爬取豆瓣信息
    if (url) {
        console.log(url)
        let options = {
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
                Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

            }
        }
        try {
            request(options, function(err, data) {
                if (err) {
                    console.log("爬取时出现错误:" + err)
                }
                let $ = cheerio.load(data.body)
                    // console.log(Array.from($('span.attrs>a[rel="v:directedBy"]')))
                    // for (let value of Array.from($('#info>span[property = "v:genre"]'))) {
                    //     console.log(value.children[0].data)
                    // }
                let movie = {
                        key_id: info[0],
                        movie_name: info[1],
                        key_words: info.splice(3),
                        douban_url: info[2],
                        //豆瓣电影名
                        douban_name: $('#content > h1 > span[property="v:itemreviewed"]').text().split('\t')[0],
                        //头像图片地址
                        moviePic: $("#mainpic > a > img").attr('src'),
                        //分类年份
                        tag: $('#content > h1 > span.year').text(),
                        //导演
                        director: (function() {
                            var results = [];
                            for (let value of Array.from($('span.attrs>a[rel="v:directedBy"]'))) {
                                results.push({
                                    name: value.children[0].data,
                                    name_id: value.attribs.href.split('/')[2]
                                })
                            }
                            return results
                        })(),
                        //编剧
                        screenwriter: (function() {
                            var results = []
                            for (let value of Array.from($('#info > span:nth-child(3) > span:nth-child(2)>a'))) {
                                results.push({
                                    name: value.children[0].data,
                                    name_id: value.attribs.href.split('/')[2]
                                })
                            }

                            return results
                        })(),
                        //演员
                        actor: (function() {
                            var results = [];
                            for (let value of Array.from($('#info > span.actor > span.attrs>a'))) {
                                results.push({
                                    name: value.children[0].data,
                                    name_id: value.attribs.href.split('/')[2]
                                })
                            }
                            return results
                        })(),
                        //类型
                        type: (function() {
                            var results = [];
                            for (let value of Array.from($('#info>span[property = "v:genre"]'))) {
                                results.push({
                                    tag: value.children[0].data
                                })
                            }
                            return results
                        })(),
                        //放映时间
                        releaseDate: (function() {
                            var results = [];
                            for (let value of Array.from($('#info > span[property="v:initialReleaseDate"]'))) {
                                // console.log(value);
                                results.push({
                                    time: value.attribs.content
                                })
                            }
                            return results
                        })(),
                        //时长
                        runtime: $('#info>span[property="v:runtime"]').text(),
                        //豆瓣评分
                        average: $('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > strong').text(),
                        //评分人数
                        people: $('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > div > div.rating_sum > a > span').text(),
                        //好于
                        betterThan: (function() {
                            var results = [];
                            for (let value of Array.from($('#interest_sectl > div.rating_betterthan > a'))) {
                                // console.log(value.text)
                                results.push({
                                    better: value.children[0].data
                                })
                            }
                            return results
                        })(),
                        //简介
                        synopsis: $('#link-report > span').eq(-2).text().trim(),
                        //评分分布
                        stars: {
                            stars5: $('span.stars5').next().next().text().trim(),
                            stars4: $('span.stars4').next().next().text().trim(),
                            stars3: $('span.stars3').next().next().text().trim(),
                            stars2: $('span.stars2').next().next().text().trim(),
                            stars1: $('span.stars1').next().next().text().trim(),
                        }


                    }
                    // console.log(movie)
                    //store
                var jumu_movie = new Jumu(movie)
                jumu_movie.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('剧目430 save')
                    }
                })
            })


        } catch (e) {
            console.log("catch err is:" + e)
            request(options, function(err, data) {
                if (err) {
                    console.log("爬取时出现错误:" + err)
                }
                let $ = cheerio.load(data.body)
                    // console.log(Array.from($('span.attrs>a[rel="v:directedBy"]')))
                    // for (let value of Array.from($('#info>span[property = "v:genre"]'))) {
                    //     console.log(value.children[0].data)
                    // }
                let movie = {
                        key_id: info[0],
                        movie_name: info[1],
                        key_words: info.splice(3),
                        douban_url: info[2],
                        //豆瓣电影名
                        douban_name: $('#content > h1 > span[property="v:itemreviewed"]').text().split('\t')[0],
                        //头像图片地址
                        moviePic: $("#mainpic > a > img").attr('src'),
                        //分类年份
                        tag: $('#content > h1 > span.year').text(),
                        //导演
                        director: (function() {
                            var results = [];
                            for (let value of Array.from($('span.attrs>a[rel="v:directedBy"]'))) {
                                results.push({
                                    name: value.children[0].data,
                                    name_id: value.attribs.href.split('/')[2]
                                })
                            }
                            return results
                        })(),
                        //编剧
                        screenwriter: (function() {
                            var results = []
                            for (let value of Array.from($('#info > span:nth-child(3) > span:nth-child(2)>a'))) {
                                results.push({
                                    name: value.children[0].data,
                                    name_id: value.attribs.href.split('/')[2]
                                })
                            }

                            return results
                        })(),
                        //演员
                        actor: (function() {
                            var results = [];
                            for (let value of Array.from($('#info > span.actor > span.attrs>a'))) {
                                results.push({
                                    name: value.children[0].data,
                                    name_id: value.attribs.href.split('/')[2]
                                })
                            }
                            return results
                        })(),
                        //类型
                        type: (function() {
                            var results = [];
                            for (let value of Array.from($('#info>span[property = "v:genre"]'))) {
                                results.push({
                                    tag: value.children[0].data
                                })
                            }
                            return results
                        })(),
                        //放映时间
                        releaseDate: (function() {
                            var results = [];
                            for (let value of Array.from($('#info > span[property="v:initialReleaseDate"]'))) {
                                // console.log(value);
                                results.push({
                                    time: value.attribs.content
                                })
                            }
                            return results
                        })(),
                        //时长
                        runtime: $('#info>span[property="v:runtime"]').text(),
                        //豆瓣评分
                        average: $('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > strong').text(),
                        //评分人数
                        people: $('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > div > div.rating_sum > a > span').text(),
                        //好于
                        betterThan: (function() {
                            var results = [];
                            for (let value of Array.from($('#interest_sectl > div.rating_betterthan > a'))) {
                                // console.log(value.text)
                                results.push({
                                    better: value.children[0].data
                                })
                            }
                            return results
                        })(),
                        //简介
                        synopsis: $('#link-report > span').eq(-2).text().trim(),
                        //评分分布
                        stars: {
                            stars5: $('span.stars5').next().next().text().trim(),
                            stars4: $('span.stars4').next().next().text().trim(),
                            stars3: $('span.stars3').next().next().text().trim(),
                            stars2: $('span.stars2').next().next().text().trim(),
                            stars1: $('span.stars1').next().next().text().trim(),
                        }


                    }
                    // console.log(movie)
                    //store
                var jumu_movie = new Jumu(movie)
                jumu_movie.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('剧目430 save')
                    }
                })
            })


        }
    } //如果没有豆瓣地址,则只保存csv文件中的信息
    else {
        let movie = {
                key_id: info[0],
                movie_name: info[1],
                key_words: info.splice(3),
            }
            // console.log(movie)
            //store
        var jumu_movie = new Jumu(movie)
        jumu_movie.save(function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('剧目430 save')
            }
        })
    }
}

fs.readFile('jumu.csv', function(err, data) {
    if (err) {
        return console.error(err);
    }
    // console.log(data.toString().split('\n'))
    let objs = data.toString().split('\n')
        // async.eachSeries(objs, function(obj, callback) {
        //     getinfo(obj, function() {
        //         callback()
        //     });
        // }, function(err) {
        //     console.log("err is :" + err)
        // })
    for (let i = 0; i < objs.length; i++) {
        setTimeout(function() {
            getinfo(objs[i])
        }, i * 10000)
    }
})
