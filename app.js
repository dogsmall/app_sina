'use strict';


var request = require('request').defaults({
  jar: true
})
var cheerio = require('cheerio')
var fs = require('fs')
var async = require('async')

/**
 * 获取基本信息
 */
function getinfo(url, callback) {
  let options = {
    url: url,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
      Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

    }
  }
  request(options, function (err, data) {
    if (err) {
      console.log("getinfo err is:" + err)
    }
    let $ = cheerio.load(data.body)
    let movie = {
      // 豆瓣url
      url: url,
      //豆瓣电影名
      name: $('#content > h1 > span[property="v:itemreviewed"]').text().split('\t')[0],
      //头像图片地址
      moviePic: $("#mainpic > a > img").attr('src'),
      //分类年份
      year: $('#content > h1 > span.year').text(),
      //导演
      directors: (function () {
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
      screenwriters: (function () {
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
      actors: (function () {
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
      types: (function () {
        let results = [];
        for (let value of Array.from($('#info>span[property = "v:genre"]'))) {
          results.push({
            type: value.children[0].data
          })
        }
        return results
      })(),
      //放映时间
      releaseDate: (function () {
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
      betterThan: (function () {
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
      //豆瓣成员常用标签
      tags: (function () {
        let results = [];
        for (let value of Array.from($('div.tags > div.tags-body>a'))) {
          results.push({
            tag: value.children[0].data
          })
        }
        return results
      })(),
      //影评
      longcomments: [],
    }
    callback(null, movie)
  })
}

/**
 * 获取获奖情况
 */
function getawaeds(movie, callback) {
  var options = {
    url: movie.url + "/awards/",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
      Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

    }
  }

  request(options, function (err, data) {
    let $ = cheerio.load(data.body);
    let objs = Array.from($("#content > div > div.article>div.awards"));
    let awards = []
    for (let value of objs) {
      var award = {
        name: value.childNodes[1].childNodes[1].childNodes[1].childNodes[0].data,
        url: value.childNodes[1].childNodes[1].childNodes[1].attribs.href,
        info: $(value).find("ul.award").text().trim()
      }
      awards.push(award)
    }
    movie.awards.push(awards)
    callback(null, movie)
  })

}

/**
 * 获取图片
 */

function getpics(movie, callback) {
  let options = {
    url: movie.url + "/photos?type=S",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
      Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

    }
  }
  request(options, function (err, data) {
    var $ = cheerio.load(data.body)
    console.log($('#content > div > div.article>ul>li'));
    var pics = Array.from($('#content > div > div.article>ul>li[data-id]'));
    let pictuers = []
    for (let value of pics) {
      // console.log(value.childNodes[1].childNodes[1].attribs.href)
      var pic = {
        id: value.attribs['data-id'],
        name: value.childNodes[5].childNodes[0].data.trim(),
        url: value.childNodes[1].childNodes[1].attribs.href,
        src: value.childNodes[1].childNodes[1].childNodes[1].attribs.src,
        size: value.childNodes[3].childNodes[0].data.trim()
      }
      pictuers.push(pic)
      // console.log(pic)
    }
    movie.pic.push(pictuers)
    callback(null, movie)

  })
}

/**
 * 获取影评
 */

function getlongcomments(movie, nexturl, cb) {
  let options
  if (nexturl) {
    options = nexturl
  } else {
    options = {
      url: movie.url + '/reviews',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

      }
    }
  }
  request(options, function (err, data) {
    let $ = cheerio.load(data.body);
    let objs = Array.from($('#content > div > div.article > div:nth-child(2)>div.review'))
    for (let i = 0; i < objs.length; i++) {
      setTimeout(function () {
        request(objs[i].childNodes[1].childNodes[1].childNodes[5].attribs.href, function (err, data) {
          let $ = cheerio.load(data.body)
          let filmrev = {
            longcomments_url: options.url,
            title: $('#content>h1>span').text(),
            author: {
              name: $("#content > div > div.article > div > div > div.main-hd > p > a:nth-child(2)").text().trim(),
              url: $("#content > div > div.article > div > div > div.main-hd > p > a:nth-child(2)").attr('href'),
              imgurl: $("#content > div > div.article > div > div > div.main-hd > p > a.main-avatar > img").attr('src')
            },
            time: $("#content > div > div.article > div > div > div.main-hd > p:nth-child(1) > span.main-meta").text(),
            content: $("#link-report > div").text(),
            grade: $("#content > div > div.article > div > div > div.main-hd > p:nth-child(1) > span.main-title-rating").attr("title"),

            agree: $("#content > div > div.article > div > div > div.main-ft > div.main-panel > div.main-panel-useful").children().first().children().last().text(),
            disagree: $("#content > div > div.article > div > div > div.main-ft > div.main-panel > div.main-panel-useful").children().last().children().last().text(),
            comment: []
          }
          movie.longcomments.push(filmrev)
          // let options = {
          //     url: value.childNodes[1].childNodes[1].childNodes[5].attribs.href,
          //     headers: {
          //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
          //         Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467077534.1467077534.5; __utmz=30149280.1467077534.5.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utma=223695111.1460687376.1467016532.1467020867.1467077534.3; __utmz=223695111.1467077534.3.2.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467077532%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.3.1467077795.1467020865.; ap=1; ps=y; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744; _pk_ses.100001.4cf6=*; __utmb=30149280.7.10.1467077534; __utmc=30149280; __utmb=223695111.0.10.1467077534; __utmc=223695111; __utmt=1; ue="316211030@qq.com"; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q'
          //     }
          // }
          // filmrevcomment(options, movie)
          // console.log("55555")
        })
      }, i * 2000);
    }

    hasnext($, reviews, function (err, movie, nexturl) {
      if (err) {
        console.log(err)
      }
      if (nexturl) {
        getlongcomments(movie, nexturl)
      } else {
        callback(null, movie)
      }
    })
  })

}


/**
 * 获取短评
 */

function getshortcomments(movie, nexturl, callback) {
  var options = {
    url: movie.url + '/comments',
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
      Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
    }
  }
  request(options, function (err, data) {
    if (err) {
      console.log(err)
    }
    console.log(data.body)

    let $ = cheerio.load(data.body)
    let objs = Array.from($('#comments>div.comment-item'));
    console.log(items)
    let shortcomments = []
    for (let value of objs) {
      let comment = {
        name: value.childNodes[1].childNodes[1].attribs.title,
        nameurl: value.childNodes[1].childNodes[1].attribs.href,
        picurl: value.childNodes[1].childNodes[1].childNodes[1].attribs.src,
        content: value.childNodes[3].childNodes[3].childNodes[0].data,
        agree: value.childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[0].data,
        grade: value.childNodes[3].childNodes[1].childNodes[3].childNodes[3].attribs.title,
        time: value.childNodes[3].childNodes[1].childNodes[3].childNodes[5].childNodes[0].data.trim(),

      }
      shortcomments.push(comment)
      console.log(comment)
    }
    movie.shortcomments.push(shortcomments)
    hasnext($)
  })
}

/**
 * 是否有下一页
 */
function hasnext($, channel, callback) {
  if ($('#paginator > a.next').attr('href')) {
    console.log("影评还有下一页")
    let nexturl = {
      url: movie.url + "/" + channel + $('#paginator > a.next').attr('href'),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
      }
    }
    callback(null, movie, nexturl)
    // return getfilmrevinfo(movie, nexturl)

  } else {
    console.log("这部电影的影评已经爬完")
    cb(null, movie, null)
  }
}


getinfo("https://movie.douban.com/subject/25862357", function (err, movie) {
  if (err) {
    console.log(err)
  }
  getfilmrevinfo(movie, null, function (err, movie) {
    if (err) {
      console.log(err)
    }
    console.log(movie)
  })
})
