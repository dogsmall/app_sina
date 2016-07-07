/**
 * Created by gsw on 16-4-18.
 */
var request = require('request')
var fs = require('fs')
var cheerio = require('cheerio')

var options = {
    url: 'http://api.k.sohu.com/api/channel/v6/list.go?rt=json&supportLive=1&supportWeibo=1&v=5.5.1&up=1%2C3%2C2%2C4%2C6%2C5&local=0&change=0&pid=(null)&p1=NjEyODM4ODU3Njk0NzY0NjUyNg==&pid=-1&apiVersion=34&sid=0&buildCode=27&u=1&bid=Y29tLnNvaHUubmV3c3BhcGVy'
}

request(options, function (err, data) {
    if (err) console.log(err);
    var list = [];
    //console.log(JSON.parse(data.body).channel);
    JSON.parse(data.body).channel.map(function (e) {
        list.push(e.id)
    });
    console.log(list.sort(function (a,b) {
            return a-b
        })
    );
    for (var i = 0; i < list.length; i++) {
        var id = list[i];
        opt = {
            url: "http://api.k.sohu.com/api/channel/v5/news.go?channelId=" + id + "&num=20&imgTag=1&showPic=1&picScale=11&rt=json&net=&cdma_lat=&u=5&cdma_lng=&from=preview&page=1"
        }
        request(opt, function (err, data) {
            if(err) console.log(err);
            try {
                JSON.parse(data.body);
                console.log(data.body)
            }catch (error){
                console.log(error)
            }

        })
    }
});
//http://api.iclient.ifeng.com/ClientNews?id=SYLB10,SYDT10,SYRECOMMEND&province=%E5%8C%97%E4%BA%AC%E5%B8%82&city=%E5%8C%97%E4%BA%AC%E5%B8%82&newShowType=1&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//http://api.iclient.ifeng.com/ClientNews?id=YL53,FOCUSYL53&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//良品  http://sale.iclient.ifeng.com/Api/Article/getList?gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//北京 http://api.irecommend.ifeng.com/local.php?choicetype=city&choicename=%E5%8C%97%E4%BA%AC&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//自媒体 http://api.iclient.ifeng.com/api_vampire_index?id=FOCUSZMT10&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// 凤凰卫视 http://newsvcsp.ifeng.com/vcsp/appData/news/recommend.do?&callBy=news&useType=iPhone&pageSize=20&channelId=000000-0&positionId=0&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//美女 http://api.3g.ifeng.com/clientShortNews?type=beauty&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// 军事 http://api.iclient.ifeng.com/ClientNews?id=JS83,FOCUSJS83&action=default&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// 体育 http://api.iclient.ifeng.com/ClientNews?id=TY43,FOCUSTY43,TYLIVE&action=default&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// 历史 http://api.iclient.ifeng.com/ClientNews?id=LS153,FOCUSLS153&action=default&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//汽车 http://api.iclient.ifeng.com/ClientNews?id=QC45,FOCUSQC45&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// 时尚 http://api.iclient.ifeng.com/ClientNews?id=SS78,FOCUSSS78&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// 房产 http://api.iclient.ifeng.com/ClientNews?id=FC81,FOCUSFC81&province=%E5%8C%97%E4%BA%AC%E5%B8%82&city=%E5%8C%97%E4%BA%AC%E5%B8%82&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
// FUN来了 http://api.iclient.ifeng.com/ClientNews?id=DZPD,FOCUSDZPD&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//段子 http://api.3g.ifeng.com/clientShortNews?type=joke&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//萌物 http://api.iclient.ifeng.com/clientShortNews?type=pet&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//http://api.3g.ifeng.com/clientChannelNewsSearch?k=%E5%AE%8F%E8%A7%82%E7%BB%8F%E6%B5%8E&action=default&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//http://api.iclient.ifeng.com/ClientNews?id=NXWPD,FOCUSNXWPD&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b
//http://api.iclient.ifeng.com/clientShortNews?type=phil&gv=5.1.1&av=0&proid=ifengnews&os=ios_9.3.1&vt=5&screen=1125x2001&publishid=4002&uid=e5f14c9e53fa415baeaf1dc928e8148b