/**
 * 获取短评
 */

function getshortcomments(movie, nexturl,callback) {
  let options
  if (nexturl) {
    options = nexturl
  } else {
    options = {
      url: movie.url + '/comments',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
      }
    }
  }
  setTimeout(function () {
    request(options, function (err, data) {
      if (err) {
        console.log(err)
      }
      // console.log(data.body)

      let $ = cheerio.load(data.body)
      let objs = Array.from($('#comments>div.comment-item'));
      // console.log(objs)
      let shortcomments = []
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
        console.log(comment)
        shortcomments.push(comment)
        // console.log(comment)
      }
      console.log('111')
      movie.shortcomments.push(shortcomments)
      let channel = "comments"
      hasnext($, channel, movie, function (err, movie, nexturl) {
        if (err) {
          console.log(err)
        }
        if (nexturl) {
          getshortcomments(movie, nexturl)
        } else {
          callback(null,movie) // 运行时,到这就报 callback is not function
        }

      })

    })
  }, 5000);

}

/**
 * 是否有下一页
 */
function hasnext($, channel, movie, callback) {
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
    console.log("没有下一页了")
    callback(null, movie, null)
  }
}