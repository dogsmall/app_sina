'use strict';

var request = require('request')
var cheerio = require('cheerio')

/**
 * type=[S,R,W]
 * subtype[a,o,c,w,n,f]
 * [o,p,r,t]
 */

var options = {
    url: "https://movie.douban.com/subject/4202982/photos?type=S&start=0&sortby=vote&size=a&subtype=w"
}
request(options, function(err, data) {
    var $ = cheerio.load(data.body)
    console.log($('#content > div > div.article>ul>li'));
    var pics = Array.from($('#content > div > div.article>ul>li[data-id]'));
    for (let value of pics) {
        // console.log(value.childNodes[1].childNodes[1].attribs.href)
        var pic = {
            id: value.attribs['data-id'],
            name: value.childNodes[5].childNodes[0].data.trim(),
            url: value.childNodes[1].childNodes[1].attribs.href,
            src: value.childNodes[1].childNodes[1].childNodes[1].attribs.src,
            size: value.childNodes[3].childNodes[0].data.trim()
        }
        console.log(pic)
    }
})
