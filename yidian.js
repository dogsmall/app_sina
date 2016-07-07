var request = require("request").defaults({
    jar: true
})
var cheerio = require("cheerio")
var list = ["撒旦撒旦", "as", "asda", "阿萨德", "阿什顿", "到底", "撒地区", "阿斯达"]
list.map(function(e) {
    for (var i = 1; i < 10; i++) {
        var options = {
            url: "http://weixin.sogou.com/weixin?query=" + e + "&_sug_type_=&_sug_=y&type=2&page=" + i + "&ie=utf8"
        }
        var list = []
        request(options, function(err, data) {
            if (err) {
                console.log(err)
            }
            console.log(data)
            try {
                console.log(data.body)

            } catch (e) {
                var $ = cheerio.load(data.body.toString());
                var picUrl = "http://weixin.sogou.com/antispider/" + $('img#seccodeImage').attr("src")
                list.push(picUrl);
                console.log(list)
            }

        })
    }
})