"use strict"
var request = require('request')
var cheerio = require('cheerio')

var options = {
    url: "https://movie.douban.com/subject/4202982/awards/"
}

request(options, function(err, data) {
    var $ = cheerio.load(data.body);
    var awards = Array.from($("#content > div > div.article>div.awards"));
    for (let value of awards) {
        // console.log($(value).find("ul.award").text())
        // return;
        var award = {
            name: value.childNodes[1].childNodes[1].childNodes[1].childNodes[0].data,
            url: value.childNodes[1].childNodes[1].childNodes[1].attribs.href,
            info: $(value).find("ul.award").text().trim()
        }
        console.log(award)
    }
})
