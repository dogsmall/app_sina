var request = require("request")
var fs = require("fs")



for (var i = 0; i < 3000; i++) {
    var options = {
            url: "http://weixin.sogou.com/antispider/util/seccode.php?tc=" + i,
            encoding: 'binary'
        }
        //   request('http://google.com/doodle.png')
        // .pipe(fs.createWriteStream('doodle.png'));
    request(options).pipe(fs.createWriteStream(i + '.jpg'));
}