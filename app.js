'use strict';
var request = require('request').defaults({
  jar: true
})
var cheerio = require('cheerio')
var fs = require('fs')
var async = require('async')
var Jumu = require('./models/jumu.js')

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
  setTimeout(function () {
    // console.log(options)
    request(options, function (err, data) {
      if (err) {
        console.log("getinfo err is:" + err)
      }
      let $ = cheerio.load(data.body)
      let movie = {
        //是否是研究目标
        istarget: false,
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
        //短评
        shortcomments: [],
        //图片
        pics: [],
        //获奖情况
        awards: []
      }
      callback(null, movie)
    })
  }, 1000)
}

/**
 * 获取获奖情况
 */
function getawards(movie, callback) {
  let options = {
    url: movie.url + "awards/",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
      Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
    }
  }
  // console.log(options)
  request(options, function (err, data) {
    if (err) {
      console.log("getawards is err:" + err)
    }
    let $ = cheerio.load(data.body);
    let objs = Array.from($("#content > div > div.article>div.awards"));
    for (let value of objs) {
      var award = {
        name: value.childNodes[1].childNodes[1].childNodes[1].childNodes[0].data,
        url: value.childNodes[1].childNodes[1].childNodes[1].attribs.href,
        info: $(value).find("ul.award").text().trim()
      }
      movie.awards.push(award)
    }
    callback(null, movie)
  })
}

/**
 * 获取图片
 */

function getpics(movie, nexturl, cb) {
  let options
  if (nexturl) {
    options = nexturl
  } else {
    options = {
      url: movie.url + "photos?type=S",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
      }
    }
  }
  setTimeout(function () {
    request(options, function (err, data) {
      if (err) {
        console.log("getpics is err" + err)
      }
      let $ = cheerio.load(data.body)
      let pics = Array.from($('#content > div > div.article>ul>li[data-id]'));
      for (let value of pics) {
        let pic = {
          id: value.attribs['data-id'],
          name: value.childNodes[5].childNodes[0].data.trim(),
          url: value.childNodes[1].childNodes[1].attribs.href,
          src: value.childNodes[1].childNodes[1].childNodes[1].attribs.src,
          size: value.childNodes[3].childNodes[0].data.trim()
        }
        movie.pics.push(pic)
      }
      let channel = "photos"
      hasnext($, channel, movie, cb, function (err, movie, nexturl, cb) {
        if (err) {
          console.log("getpics nextpage id err" + err)
        }
        if (nexturl) {
          getpics(movie, nexturl, cb)
        } else {
          cb(null, movie)
        }
      })

    })
  }, 1000);

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
      url: movie.url + 'reviews',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

      }
    }
  }
  setTimeout(function () {
    request(options, function (err, data) {
      let $ = cheerio.load(data.body);
      let objs = Array.from($('#content > div > div.article > div:nth-child(2)>div.review'))
      for (let i = 0; i < objs.length; i++) {
        setTimeout(function () {
          let options = {
            url: objs[i].childNodes[1].childNodes[1].childNodes[5].attribs.href,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
              Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

            }
          }
          request(options, function (err, data) {
            let $ = cheerio.load(data.body)
            let filmrev = {
              longcomments_url: options.url,
              title: $('#content>h1>span[property="v:summary"]').text(),
              author: {
                name: $("#content > div > div.article > div > div > div.main-hd > p > a:nth-child(2)").text().trim(),
                url: $("#content > div > div.article > div > div > div.main-hd > p > a:nth-child(2)").attr('href'),
                imgurl: $("#content > div > div.article > div > div > div.main-hd > p > a.main-avatar > img").attr('src')
              },
              time: $("div.main-hd > p > span.main-meta").text().trim(),
              content: $('#link-report > div[property="v:description"]').text().trim(),
              grade: $("div.main-hd > p> span.main-title-rating").attr("title"),
              agree: $("a.btn-useful").next().text(),
              disagree: $("a.btn-unuseful").next().text(),
              comment: []
            }
            movie.longcomments.push(filmrev)
          })
        }, i * 1000);
      }
      let channel = "reviews"
      hasnext($, channel, movie, cb, function (err, movie, nexturl, cb) {
        if (err) {
          console.log(err)
        }
        if (nexturl) {
          getlongcomments(movie, nexturl, cb)
        } else {

          cb(null, movie)
        }
      })
    })
  }, 25000)

}

/**
 * 获取影评的评论  (暂缺)
 */

function getcomments_com(movie, callback) {
  // let options = {
  //     url: value.childNodes[1].childNodes[1].childNodes[5].attribs.href,
  //     headers: {
  //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
  //         Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467077534.1467077534.5; __utmz=30149280.1467077534.5.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utma=223695111.1460687376.1467016532.1467020867.1467077534.3; __utmz=223695111.1467077534.3.2.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467077532%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.3.1467077795.1467020865.; ap=1; ps=y; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744; _pk_ses.100001.4cf6=*; __utmb=30149280.7.10.1467077534; __utmc=30149280; __utmb=223695111.0.10.1467077534; __utmc=223695111; __utmt=1; ue="316211030@qq.com"; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q'
  //     }
  // }
  // filmrevcomment(options, movie)
  // console.log("55555")
}

/**
 * 获取短评
 */

function getshortcomments(movie, nexturl, cb) {
  let options
  if (nexturl) {
    options = nexturl
  } else {
    options = {
      url: movie.url + 'comments',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
      }
    }
  }
  setTimeout(function () {
    request(options, function (err, data) {
      if (err) {
        console.log("getshortcomments is err :" + err)
      }
      let $ = cheerio.load(data.body)
      let objs = Array.from($('#comments>div.comment-item'));
      for (let value of objs) {
        let comment = {
          name: $(value).find('div.avatar>a').attr("title"),
          nameurl: $(value).find('div.avatar>a').attr("href"),
          picurl: $(value).find('div.avatar>a>img').attr('src'),
          content: $(value).find('div.comment>p').text().trim(),
          agree: $(value).find('div.comment>h3>span.comment-vote>span').text().trim(),
          grade: $(value).find('div.comment>h3>span.comment-info>span.rating').attr("title"),
          time: $(value).find('div.comment>h3>span.comment-info>span').eq(-1).text().trim()

        }
        movie.shortcomments.push(comment)
      }
      let channel = "comments"
      hasnext($, channel, movie, cb, function (err, movie, nexturl, cb) {
        if (err) {
          console.log("getshortcomments is err:" + err)
        }
        if (nexturl) {
          getshortcomments(movie, nexturl, cb)
        } else {
          cb(null, movie)
        }
      })
    })
  }, 1000);

}

/**
 * 是否有下一页
 */
function hasnext($, channel, movie, cb, callback) {
  if (channel === "photos" || channel === "tag") {
    if ($('div.paginator >span.next>a').attr('href')) {
      console.log("图片还有下一页")
      let nexturl = {
        url: $('div.paginator >span.next>a').attr('href'),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
          Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
        }
      }
      callback(null, movie, nexturl, cb)
    } else {
      console.log("图片没有下一页了")
      callback(null, movie, null, cb)
    }
  } else {
    if ($('#paginator > a.next').attr('href')) {
      console.log("影评还有下一页")
      let nexturl = {
        url: movie.url + channel + $('#paginator > a.next').attr('href'),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
          Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
        }
      }
      callback(null, movie, nexturl, cb)
    } else {
      console.log("没有下一页了")
      callback(null, movie, null, cb)
    }
  }
}


/**
 * 获取一年的所有豆瓣剧目url
 */
function geturls(year, urls, nexturl, cb) {
  console.log(urls)
  let options
  if (nexturl) {
    options = nexturl
  } else {
    options = {
      url: "https://movie.douban.com/tag/" + year + "?start=0&type=T",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
      }
    }
  }
  setTimeout(function () {
    console.log(options)
    request(options, function (err, data) {
      if (err) {
        console.log(err)
      }
      let $ = cheerio.load(data.body)
      let arr = Array.from($("div[id^='collect_form_']"));
      for (let value of arr) {
        urls.push("https://movie.douban.com/subject/" + value.attribs.id.split('_')[2] + "/")
      }
      let channel = "tag"
      hasnext($, channel, urls, cb, function (err, urls, nexturl, cb) {
        if (err) {
          console.log("getshortcomments is err:" + err)
        }
        if (nexturl) {
          geturls(null, urls, nexturl, cb)
        } else {
          cb(null, urls)
        }
      })
    })
  }, 2000);
}

/**
 * eachSeries的执行函数
 */
function dojumu(value, callback) {
  console.log("进入dojumu")
  let url, info
  //判断,如果value是url的话,分割后长度小于二,否则就是研究文件的分割
  if (value.split('\t').length < 2) {
    url = value
  } else {
    info = value.split('\t')
    url = info[2]
  }
  console.log(url)
  if (url === "") {
    console.log("豆瓣没有该剧目")
    let movie = {
      istarget: true,
      target_name: info[1],
      target_id: info[0],
      key_words: info.splice(3),
    }
    console.log(movie.target_name)
    //保存
    let jumu_movie = new Jumu(movie)
    jumu_movie.save(function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log("文件已保存1")
      }
      callback(null)
    })
  } else {
    console.log("存在豆瓣链接")
    Jumu.findOne({ url: url }, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log("剧目已经存在")
        // result.istarget = true
        // console.log(result)
        Jumu.create(result, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log("文件已保存2")
          }
          callback(null)
        })
      } else {
        console.log("剧目不存在,正在爬取")
        getinfo(url, function (err, movie) {
          console.log("基本信息已完成")
          if (err) {
            console.log(err)
          }
          getshortcomments(movie, null, function (err, movie) {
            console.log("短评已经完成")
            if (err) {
              console.log(err)
            }
            getlongcomments(movie, null, function (err, movie) {
              console.log("影评已经完成")
              if (err) {
                console.log(err)
              }
              getawards(movie, function (err, movie) {
                console.log("获奖情况已经完成")
                if (err) {
                  console.log(err)
                }
                getpics(movie, null, function (err, movie) {
                  console.log("图片已经完成")
                  if (err) {
                    console.log(err)
                  }
                  movie.istarget = true
                  Jumu.create(movie, function (err) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log("文件已保存3")
                    }
                    callback(null)
                  })
                  // console.log(movie)
                  // callback(null)
                })
              })
            })
          })
        })
      }
    })
  }
}
/**
 * 用来爬取豆瓣十年剧目的函数,数组是年份
 */
let urls = []

function dodouban(year, callback) {
  let urls = []
  geturls(year, urls,null,function (err, urls) {
    if (err) {
      console.log(err)
    }
    async.eachSeries(urls, dojumu, function (err) {
      if (err) {
        console.log(err)
      }
      console.log("一年豆瓣已经爬完")
      callback(null)
    })

    

  })

}

/**
 * 读取文件,将文件按行分割
 */
// fs.readFile('jumu.csv', function (err, data) {
//   if (err) {
//     console.log(err)
//   }
//   if (data !== "") {
//     console.log("文件不为空")
//     let objs = data.toString().split('\n')
//     async.eachSeries(objs, dojumu, function (err) {
//       if (err) {
//         console.log(err)
//       }
//       console.log("运行完成")
//     })
//   }
// })

/**
 *这是爬豆瓣全部剧目部分的
 */

//  运行时一定要把判断是否已存在中的movie.istarget=true去掉
let years = [2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016]
async.eachSeries(years, dodouban, function (err) {
  if (err) {
    console.log(err)
  }
  console.log("10年豆瓣已经爬完")
})