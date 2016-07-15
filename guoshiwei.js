'use strict'
var originRequest = require('request');
var cheerio = require('cheerio')


function request(url, callback) {
    originRequest({
        url: url,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.11 Safari/537.36'
                // 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
        }
    }, callback);
}

request("https://movie.douban.com/subject/6517421/reviews?start=24&filter=&limit=20", function(err, data) {
    if (err) {
        console.log(err)
    }
    console.log(data.body)
})
