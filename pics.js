'use strict';

var request = require('request').defaults({
    jar: true
})
var cheerio = require('cheerio')

/**
 * type=[S,R,W]
 * subtype[a,o,c,w,n,f]
 * [o,p,r,t]
 */

let options = {
    url: "https://movie.douban.com/subject/4202982/photos?type=S",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
        Cookie: ' ll="108288"; bid=vLofpXemIo0; __utma=30149280.798883795.1467016530.1467016530.1467016875.2; __utmc=30149280; __utmz=30149280.1467016875.2.2.utmcsr=sns-nav|utmccn=(not%20set)|utmcmd=douban; __utma=223695111.1460687376.1467016532.1467016532.1467016532.1; __utmc=223695111; __utmz=223695111.1467016532.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1467016534%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_id.100001.4cf6=fab42eaaeed692a8.1467016534.1.1467016918.1467016534.; ap=1; ps=y; dbcl2="137448756:e9/xvl5xGp4"; ck=LV5q; push_noty_num=0; push_doumail_num=5; __utmv=30149280.13744'
    }
}
request(options, function (err, data) {
    var $ = cheerio.load(data.body)
    // console.log(data.body)
    // console.log($('#content > div > div.article>ul>li'));
    var pics = Array.from($('#content > div > div.article>ul>li[data-id]'));
    for (let value of pics) {
        // console.log(value.childNodes[1].childNodes[1].attribs.href)
        let pic = {
            id: value.attribs['data-id'],
            name: value.childNodes[5].childNodes[0].data.trim(),
            url: value.childNodes[1].childNodes[1].attribs.href,
            src: value.childNodes[1].childNodes[1].childNodes[1].attribs.src,
            size: value.childNodes[3].childNodes[0].data.trim()
        }
        console.log(pic)
    }
})
