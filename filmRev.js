"use strict"
var request = require('request').defaults({
  jar: true
})
var cheerio = require('cheerio')

var options = {
  url: 'https://movie.douban.com/subject/10831445/reviews',
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
    Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'

  }
}

var filmrevinfo = function(options) {
  console.log(options)
  let filmrevurl = options
  setTimeout(function() {
    console.log(filmrevurl)
    request(filmrevurl, function(err, data) {
      // console.log(data)
      // console.log(data.body)

      let $ = cheerio.load(data.body);
      let objs = Array.from($('#content > div > div.article > div:nth-child(2)>div.review'))
      for (let value of objs) {
        let url = value.childNodes[1].childNodes[1].childNodes[5].attribs.href

        request(value.childNodes[1].childNodes[1].childNodes[5].attribs.href, function(err, data) {
          let $ = cheerio.load(data.body)
          let filmrev = {
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
          console.log("11111")
          console.log(value.childNodes[1].childNodes[1].childNodes[5].attribs.href)
          let options = {
            url: value.childNodes[1].childNodes[1].childNodes[5].attribs.href,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
              Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467077534.1467077534.5; __utmz=30149280.1467077534.5.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utma=223695111.1460687376.1467016532.1467020867.1467077534.3; __utmz=223695111.1467077534.3.2.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467077532%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.3.1467077795.1467020865.; ap=1; ps=y; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744; _pk_ses.100001.4cf6=*; __utmb=30149280.7.10.1467077534; __utmc=30149280; __utmb=223695111.0.10.1467077534; __utmc=223695111; __utmt=1; ue="316211030@qq.com"; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q'

            }
          }

          filmrevcomment(options, filmrev)
          console.log("55555")
            // console.log(filmrev)
        })
      }

      if ($('#paginator > a.next').attr('href')) {
        console.log("影评还有下一页")
        let options = {
          url: "https://movie.douban.com/subject/10831445/reviews" + $('#paginator > a.next').attr('href'),
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
          }
        }

        console.log(options)
        return filmrevinfo(options)

      } else {
        console.log("这部电影的影评已经爬完")
        return false
      }
    })
  }, 60000)
}
filmrevinfo(options)

var filmrevcomment = function(options, objs) {
  let commenturl = options
  let filmrev = objs
  setTimeout(function() {
    console.log("进入comment()");
    request(commenturl, function(err, data) {
      let $ = cheerio.load(data.body)
      console.log("进入req");
      let comments = Array.from($('div#comments>div.comment-item>div.content.report-comment'))
        // console.log(comments)

      for (let value of comments) {
        filmrev.comment.push({
          time: $(value).find('.author>span').text(),
          author: $(value).find('.author>a').text(),
          authorUrl: $(value).find('.author>a').attr('href'),
          content: $(value).find('p').text()
        })
      }
      if ($("#comments > div.paginator > span.next>a").attr('href')) {
        console.log("111")
        let options = {
          url: $("#comments > div.paginator > span.next>a").attr('href'),
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467077534.1467077534.5; __utmz=30149280.1467077534.5.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utma=223695111.1460687376.1467016532.1467020867.1467077534.3; __utmz=223695111.1467077534.3.2.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467077532%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.3.1467077795.1467020865.; ap=1; ps=y; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744; _pk_ses.100001.4cf6=*; __utmb=30149280.7.10.1467077534; __utmc=30149280; __utmb=223695111.0.10.1467077534; __utmc=223695111; __utmt=1; ue="316211030@qq.com"; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q'
          }
        }
        return filmrevcomment(options, filmrev)

      } else {
        console.log("没有下一页了")
        console.log(filmrev.comment.length)
        return false
      }

      // console.log(comments)
    })
  }, 20000)
}