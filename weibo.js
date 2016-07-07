var lineReader = require('line-reader');
var fs = require("fs");
var csv = require("csv")


lineReader.eachLine('weibo.txt', function(line, last) {
    if (line.match(/#.*?#/g))
        line.match(/#.*?#/g).map(function(e) {
            console.log(e)
        })
        // list.push(line.match(/#.*?#/g))
        // console.log(line.match(/#.*?#/g));
});