'use strict';

//引用部分
var fs = require("fs");
var async = require('async')
var request = require('request').defaults({
    jar: true
})
var cheerio = require('cheerio')

//
// var data = fs.readFileSync('jumu.csv');
// let objs = data.toString().split('\n')
//
// console.log(objs)

function geturl(options, callback) {
    request(options, function(err, data) {
        if (err) {
            console.log("获取电影err:" + err)
        }
        let $ = cheerio.load(data.body)
        let urls = []
        let arr = Array.from($("tr.item>td.top>a"));
        for (let value of arr) {
            urls.push(value.attribs.href)
        }
        callback(null, urls)
    })

}

function getinfo(urls) {
    for (var i = 0; i < urls.length; i++) {
        let options = {
            url: urls[i],
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
                Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

            }
        }
        request(options, function(err, data) {
            if (err) {
                console.log("getinfo err is:" + err)
            }
            let $ = cheerio.load(data.body)
            let movie = {
                    // 豆瓣url
                    url: "https://movie.douban.com/subject/" + id,
                    //豆瓣电影名
                    name: $('#content > h1 > span[property="v:itemreviewed"]').text().split('\t')[0],
                    //头像图片地址
                    moviePic: $("#mainpic > a > img").attr('src'),
                    //分类年份
                    year: $('#content > h1 > span.year').text(),
                    //导演
                    directors: (function() {
                        let results = [];
                        for (let value of Array.from($('span.attrs>a[rel="v:directedBy"]'))) {
                            results.push({
                                name: value.children[0].data,
                                name_id: value.attribs.href.split('/')[2]
                            })
                        }
                        return results
                    })(),
                    //编剧
                    screenwriters: (function() {
                        let results = []
                        for (let value of Array.from($('#info > span:nth-child(3) > span:nth-child(2)>a'))) {
                            results.push({
                                name: value.children[0].data,
                                name_id: value.attribs.href.split('/')[2]
                            })
                        }

                        return results
                    })(),
                    //演员
                    actors: (function() {
                        let results = [];
                        for (let value of Array.from($('#info > span.actor > span.attrs>a'))) {
                            results.push({
                                name: value.children[0].data,
                                name_id: value.attribs.href.split('/')[2]
                            })
                        }
                        return results
                    })(),
                    //内容类型
                    types: (function() {
                        let results = [];
                        for (let value of Array.from($('#info>span[property = "v:genre"]'))) {
                            results.push({
                                type: value.children[0].data
                            })
                        }
                        return results
                    })(),
                    //放映时间
                    releaseDate: (function() {
                        let results = [];
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
                        let results = [];
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
                    },
                    tags: (function() {
                        let results = [];
                        for (let value of Array.from($('div.tags > div.tags-body>a'))) {
                            results.push({
                                tag: value.children[0].data
                            })
                        }
                    })
                }
                // console.log("获取原始:" + movie)
            console.log(movie)
        })
    }
}

function getshortcomm(movie) {
    //获取短评
    //TODO



    //TODO

}

function getlongcomm(movie) {

}

function getpics(movie, callback) {
    callback(null, movie)
    console.log(movie)
}

function getawards(movie) {

}

function next($, callback) {
    if ($('span.next > a').attr('href')) {
        let url = $("span.next > a").attr('href')
        console.log("开始下一页")
        callback(null, url)
    }
}

function crawler(url, callback) {
    console.log(url)
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
        }
    }
    request(options, function(err, data) {
        if (err) {
            console.log("list 页面出错")
        }
        let $ = cheerio.load(data.body)
        geturl(options, function(err, urls) {
            if (err) {
                console.log("geturls is err:" + err)
            }
            getinfo(urls, function(err, movie) {
                if (err) {
                    console.log("getinfo is err:" + err)
                }
                getpics(movie, function(err, movie) {
                    console.log(movie)
                    next($, function(err, url) {
                        crawler(url)
                        callback(null)

                    })
                })
            })
        })

    })


}



/**
 *
 * 定义全局变量
 * @type {Number}
 */
var endYear = 2016;
var startYear = 2006;
var urls = [];
for (let i = 2006; i < 2017; i++) {
    // console.log("https://movie.douban.com/tag/" + i)
    urls.push("https://movie.douban.com/tag/" + i)
}
/**
 * eachSeries运行每年的url
 * @param  {[type]} urls         [description]
 * @param  {[type]} crawler      [description]
 * @param  {[type]} function(err [description]
 * @return {[type]}              [description]
 */
async.eachSeries(urls, crawler, function(err) {
    if (err) {
        console.log("回调中报错:" + err)
    }
    console.log("All Done")

})
