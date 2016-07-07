'use strict'
var request = require('request')
var cheerio = require('cheerio')


var options = {
    url: 'https://movie.douban.com/subject/6517421/reviews?start=24&filter=&limit=20',
    header: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/48.0.2564.82 Chrome/48.0.2564.82 Safari/537.36'
    }
}
request(options, function(err, data) {
    if (err) {
        console.log(err)
    }
    console.log(data.body)

    var $ = cheerio.load(data.body)
    var items = Array.from($('#comments>div.comment-item'));
    console.log(items)

    for (let value of items) {
        // console.log(value.childNodes[3].childNodes[1].childNodes[3].childNodes[5].childNodes[0].data.trim());
        var comment = {
            name: value.childNodes[1].childNodes[1].attribs.title,
            nameurl: value.childNodes[1].childNodes[1].attribs.href,
            picurl: value.childNodes[1].childNodes[1].childNodes[1].attribs.src,
            content: value.childNodes[3].childNodes[3].childNodes[0].data,
            agree: value.childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[0].data,
            grade: value.childNodes[3].childNodes[1].childNodes[3].childNodes[3].attribs.title,
            time: value.childNodes[3].childNodes[1].childNodes[3].childNodes[5].childNodes[0].data.trim(),

        }
        console.log(comment)
    }
    console.log($('#paginator'))
        // var url = $('#paginator > a.next')
        // console.log(url)
        // if ($('#paginator > a.next').attribs.href) {
        //     options.url = "https://movie.douban.com/subject/4202982/comments" + url
        //     return options
        // } else {
        //     return false
        // }
})
