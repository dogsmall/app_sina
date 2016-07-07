'use strict';
var request = require("request").defaults({
    jar: true
})
var async = require('async');
var cheerio = require("cheerio")
for (var m = 1; m < 135; m++) {

    let onTop = function(err, data) {
        if (err) {
            console.log(err)
        }
        var $ = cheerio.load(JSON.parse(data.body.match(/{.*?}/g)[0]).html)
            // console.log($("li.pt_li:nth-child(n)").length)
        var obj = {}
        for (let i = 1; i < ($("li.pt_li:nth-child(n)").length + 1); i++) {
            var s = $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)").text().trim().slice(-1)
            if (s == "#") {
                obj = {
                    name: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)").text().trim(),
                    tags: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(3)").text().replace(/\s/gm, ""),
                    readNum: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)").text(),
                    top: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)").text().match(/\d+/g) ? $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)").text().match(/\d+/g)[0] : -1
                }
                console.log(obj.top);
            } else {

                var option = {
                    url: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)").attr('href'),
                    headers: {
                        Cookie: "SINAGLOBAL=9691354532260.447.1462341670340; UOR=y.qq.com,widget.weibo.com,login.sina.com.cn; wvr=6; YF-Page-G0=f017d20b1081f0a1606831bba19e407b; SUS=SID-2924881707-1464252277-JA-3vs48-91c982b42cf33f63c468a202bf558c37; SUE=es%3D863e75ae84f0566c62e88a91af50cc64%26ev%3Dv1%26es2%3D6c9aed5abd045945e6d933f8c669ca22%26rs0%3DaHCjC9jOh13orQdeDtketactoC%252F7X4gc0lN65%252Fot7a5%252F83XEDPPJunbC9FjM%252BpmZ79ek4X7qasFgF%252FqvCrqBk0ysIl55QqFdKFNJuRn5fOGdVQaznYRzkPcMUmaeg1CcCdsI7khLfJQwedw9SMyaZcrlm2mOYte4MVjakKvBka4%253D%26rv%3D0; SUP=cv%3D1%26bt%3D1464252277%26et%3D1464338677%26d%3Dc909%26i%3D8c37%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D0%26st%3D0%26uid%3D2924881707%26name%3D18335153609%2540sina.cn%26nick%3D%25E7%2594%25A8%25E6%2588%25B72924881707%26fmp%3D%26lcp%3D2014-10-05%252023%253A48%253A42; SUB=_2A256QsclDeRxGeRH6VYZ-C_LyzuIHXVZOb_trDV8PUNbvtAMLUflkW9LHesgAapTvmP1ro8Z9V_myrWZQFCxAg..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5f8TiH-ew4DsiVdcFTyJ9K5JpX5KMhUgL.Foz4eoBR1h2NehM2dJLoI0qLxKqL1K-LBo5LxK-LBKBLB-2LxK-LBK-L1hMLxK.L1heLB-BLxKBLBonL1KqLxKBLB.eL1-qt; SUHB=0IIVlLMPEtDE2T; ALF=1495788277; SSOLoginState=1464252277; _s_tentry=-; Apache=2003043198492.378.1464252457174; ULV=1464252457247:8:8:4:2003043198492.378.1464252457174:1464229400469"

                    }
                }

                let onResponse = function(i) {
                    return function(err, data) {
                        if (err) {
                            console.log(err);
                        }

                        obj = {
                            tags: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(3)").text().replace(/\s/gm, ""),
                            readNum: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)").text(),
                            top: $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)").text().match(/\d+/g) ? $("li.pt_li:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)").text().match(/\d+/g)[0] : -1
                        }

                        obj.name = data.body.match(/\[\'onick\'\]\=.*?;/g)[0].match(/#.*?#/g)[0]
                        console.log(obj.name)
                    };

                };
                request(option, onResponse(i));
            }
        }
    };

    setTimeout((function(m) {
        return function() {
            console.log(m);
            let url = "http://d.weibo.com/100803?pids=Pl_Discover_Pt6Rank__5&cfs=920&Pl_Discover_Pt6Rank__5_filter=hothtlist_type=1&Pl_Discover_Pt6Rank__5_page=" + m + "&ajaxpagelet=1&__ref=/100803&_t=FM_146422424525637";
            let options = {
                url: url,
                headers: {
                    Referer: "http://d.weibo.com/100803?pids=Pl_Discover_Pt6Rank__5&cfs=&Pl_Discover_Pt6Rank__5_filter=hothtlist_type%3D1",
                    Cookie: "SINAGLOBAL=9691354532260.447.1462341670340; UOR=y.qq.com,widget.weibo.com,login.sina.com.cn; wvr=6; YF-Page-G0=f017d20b1081f0a1606831bba19e407b; SUS=SID-2924881707-1464252277-JA-3vs48-91c982b42cf33f63c468a202bf558c37; SUE=es%3D863e75ae84f0566c62e88a91af50cc64%26ev%3Dv1%26es2%3D6c9aed5abd045945e6d933f8c669ca22%26rs0%3DaHCjC9jOh13orQdeDtketactoC%252F7X4gc0lN65%252Fot7a5%252F83XEDPPJunbC9FjM%252BpmZ79ek4X7qasFgF%252FqvCrqBk0ysIl55QqFdKFNJuRn5fOGdVQaznYRzkPcMUmaeg1CcCdsI7khLfJQwedw9SMyaZcrlm2mOYte4MVjakKvBka4%253D%26rv%3D0; SUP=cv%3D1%26bt%3D1464252277%26et%3D1464338677%26d%3Dc909%26i%3D8c37%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D0%26st%3D0%26uid%3D2924881707%26name%3D18335153609%2540sina.cn%26nick%3D%25E7%2594%25A8%25E6%2588%25B72924881707%26fmp%3D%26lcp%3D2014-10-05%252023%253A48%253A42; SUB=_2A256QsclDeRxGeRH6VYZ-C_LyzuIHXVZOb_trDV8PUNbvtAMLUflkW9LHesgAapTvmP1ro8Z9V_myrWZQFCxAg..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5f8TiH-ew4DsiVdcFTyJ9K5JpX5KMhUgL.Foz4eoBR1h2NehM2dJLoI0qLxKqL1K-LBo5LxK-LBKBLB-2LxK-LBK-L1hMLxK.L1heLB-BLxKBLBonL1KqLxKBLB.eL1-qt; SUHB=0IIVlLMPEtDE2T; ALF=1495788277; SSOLoginState=1464252277; _s_tentry=-; Apache=2003043198492.378.1464252457174; ULV=1464252457247:8:8:4:2003043198492.378.1464252457174:1464229400469"
                }
            };
            request(options, onTop);
        }
    })(m), 5000 * m)

}
