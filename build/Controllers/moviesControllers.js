"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const superagent = require("superagent");
const charset = require("superagent-charset");
const movie_1 = require("../Model/movie");
const request = charset(superagent);
const allPages = 10; // 爬10页
let index = 0;
const url = "http://www.ygdy8.net/html/gndy/dyzz/";
const flyController = (ctx) => __awaiter(this, void 0, void 0, function* () {
    while (index < 10) {
        yield spyder(url, index);
        index++;
    }
    ctx.body = "正在努力爬取数据中....";
});
exports.flyController = flyController;
const moviesController = (ctx) => __awaiter(this, void 0, void 0, function* () {
    const size = ctx.query['size'];
    let movies;
    if (size) {
        movies = yield movie_1.MovieModel.getMoviesByIndexandSize(0, parseInt(size));
    }
    else {
        movies = yield movie_1.MovieModel.getMoviesByIndexandSize(0, 20);
    }
    ctx.body = movies;
});
exports.moviesController = moviesController;
const spyder = (url, index) => __awaiter(this, void 0, void 0, function* () {
    let p = new Promise((resovle, rejcet) => {
        let list = "list_23_" + index + ".html";
        let allurl = url + list;
        request.get(allurl)
            .charset('gbk')
            .end(function (err, response) {
            if (!response.text) {
                return;
            }
            let $ = cheerio.load(response.text);
            $('.co_content8').find('ul').find('table').each((idx, elment) => {
                const $element = $(elment);
                const a = $element.find('tr').eq(1).find('td').eq(1).find('b').find('a').text();
                const b = $element.find('tr').eq(1).find('td').eq(1).find('b').find('a').attr('href');
                const c = $element.find('tr').eq(2).find('td').eq(1).find('font').text();
                const components = c.split('\r\n');
                const date = components[0];
                var d = $element.find('tr').eq(3).find('td').eq(0).text();
                var movie = new movie_1.MovieClassModel();
                movie.title = a;
                movie.href = "http://www.ygdy8.net/" + b;
                movie.otherInfo = d;
                movie.date = date;
                movie.webSiteFrom = "电影天堂";
                spyderDetail(movie.href, movie).then(movie => {
                    movie_1.MovieModel.createMovieBy(movie);
                    resovle(movie);
                }).catch(e => {
                    console.log(e);
                });
            });
        });
    });
    return p;
});
function spyderDetail(url, movie) {
    let p = new Promise((resolve, reject) => {
        spyderRequest(url).then(response => {
            const $ = cheerio.load(response);
            $('div[id="Zoom"]').find("span").each(function (idx, el) {
                if (idx != 0) {
                    return;
                }
                $(el).find('img').each((idx, el) => {
                    if (idx == 0) {
                        movie.img = $(el).attr('src');
                    }
                    else {
                        movie.allimg = $(el).attr('src');
                    }
                });
                let z = $(el).text();
                let items = z.split('◎');
                items.shift();
                items.forEach(function (item) {
                    getItem(item, movie);
                });
                let href = $(el).find('table').each((index, el) => {
                    if (index == 0) {
                        let a = $(el).find('tbody').find('tr').find('td').find('a').text();
                        movie.download_href = a;
                    }
                    else {
                        return;
                    }
                });
                resolve(movie);
            });
        });
    });
    return p;
}
function spyderRequest(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let p = new Promise((resolve, reject) => {
            request.get(url).charset('gbk').end(function (err, response) {
                if (err) {
                    reject(err);
                }
                if (!response.text) {
                    reject(new Error("no result"));
                }
                resolve(response.text);
            });
        });
        return p;
    });
}
function getItem(item, movie) {
    if (item.match("片　　名")) {
        movie.originName = item;
    }
    if (item.match("译　　名")) {
        movie.transformName = item;
    }
    if (item.match("年　　代")) {
        movie.age = item;
    }
    if (item.match("国　　家")) {
        movie.country = item;
    }
    if (item.match("类　　别")) {
        movie.filter = item;
    }
    if (item.match("语　　言")) {
        movie.language = item;
    }
    if (item.match("字　　幕")) {
        movie.subtitle = item;
    }
    if (item.match("IMDb评分")) {
        movie.commentScores = item;
    }
    if (item.match("视频尺寸")) {
        movie.size = item;
    }
    if (item.match("片　　长")) {
        movie.time = item;
    }
    if (item.match("导　　演")) {
        movie.director = item;
    }
    if (item.match("主　　演")) {
        movie.actors = item;
    }
    if (item.match("简　　介")) {
        movie.introduction = item;
    }
}
//# sourceMappingURL=moviesControllers.js.map