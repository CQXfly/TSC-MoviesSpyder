import {IRouterContext} from 'koa-router'
import * as cheerio from 'cheerio'
import * as superagent from 'superagent'
import {Request,Response} from 'superagent'
import * as charset from 'superagent-charset'
import * as Mongoose from 'mongoose'
import {MovieModel, IMovie,MovieClassModel} from '../Model/movie'

const request = charset(superagent)
const allPages = 10;// 爬10页
let index = 0;
const url = "http://www.ygdy8.net/html/gndy/dyzz/";

const flyController = async (ctx:IRouterContext) =>{
    
    while(index < 10 ){
        index ++
        await spyder(url,index)
         
    }
    ctx.body = "正在努力爬取数据中...."
}

const moviesController = async (ctx:IRouterContext) => {
    const size =ctx.query['size']
    let movies
    if (size){
        movies = await MovieModel.getMoviesByIndexandSize(0,parseInt(size))
    }else{
        movies = await MovieModel.getMoviesByIndexandSize(0,20)
    }
    
    ctx.body = movies
}


const spyder = async (url:string,index : number) : Promise<MovieClassModel> => {
    let p = new Promise<MovieClassModel>((resovle,rejcet)=>{
        let list = "list_23_" + index + ".html"
        let allurl = url + list
        
        request.get(allurl)
        .charset('gbk')
        .end(function (err:Error, response:any) {
            if(!response.text){return}
            let $ = cheerio.load(response.text)
            $('.co_content8').find('ul').find('table').each((idx,elment)=>{
                
                const $element = $(elment)
             
                const a = $element.find('tr').eq(1).find('td').eq(1).find('b').find('a').text();
                const b = $element.find('tr').eq(1).find('td').eq(1).find('b').find('a').attr('href');
                const c = $element.find('tr').eq(2).find('td').eq(1).find('font').text();
                const components = c.split('\r\n')
                const date = components[0];
                var d = $element.find('tr').eq(3).find('td').eq(0).text();
                var movie = new MovieClassModel();
                movie.title = a;
                movie.href = "http://www.ygdy8.net/" + b;
                movie.otherInfo = d;
                movie.date = date;
                movie.webSiteFrom = "电影天堂";
                
                spyderDetail(movie.href,movie).then(movie => {
                    MovieModel.createMovieBy(movie)
                    resovle(movie)
                }).catch(e => {
                    console.log(e)
                })

            })
          
        });
    })

    return p;
}


function spyderDetail(url:string,movie:MovieClassModel):Promise<MovieClassModel> {

    let p = new Promise<MovieClassModel>((resolve,reject)=>{
        spyderRequest(url).then(response =>{
            
            const $ = cheerio.load(response)



            $('div[id="Zoom"]').find("span").each(function (idx,el){
                if (idx != 0){
                    return
                }

                $(el).find('img').each((idx,el) => {
                    if (idx == 0) {movie.img = $(el).attr('src')}
                    else {
                        movie.allimg = $(el).attr('src')
                    }
                })

                let z = $(el).text();
                let items = z.split('◎');
                items.shift();
                items.forEach(function (item) {
                    getItem(item,movie)
                });

                let href = $(el).find('table').each((index,el)=>{
                    if (index == 0) {
                        let a = $(el).find('tbody').find('tr').find('td').find('a').text()
                        movie.download_href = a
                    } else {
                        return
                    }
                })
                
                resolve(movie)

            })
        })
    })
    return p  
}

async function spyderRequest(url:string) {
    let p = new Promise<string>((resolve,reject)=>{
        request.get(url).charset('gbk').end(function (err:Error, response:Response){
            if(err){
                reject(err)
            }
            if(!response.text) { reject(new Error("no result"))}
            resolve(response.text)
        }) 
    })
    return p
}

function getItem(item:string,movie:MovieClassModel) {
    if (item.match("片　　名")){
        movie.originName = item;
    }
    if(item.match("译　　名")){
        movie.transformName = item;
    }

    if(item.match("年　　代")){
        movie.age = item;
    }
    if(item.match("国　　家")){
        movie.country = item;
    }

    if(item.match("类　　别")){
        movie.filter = item;
    }

    if(item.match("语　　言")){
        movie.language = item;
    }

    if(item.match("字　　幕")){
        movie.subtitle = item;
    }

    if(item.match("IMDb评分")){
        movie.commentScores = item;
    }

    if(item.match("视频尺寸")){
        movie.size = item;
    }


    if (item.match("片　　长")){

        movie.time = item;
    }

    if (item.match("导　　演")){
        movie.director = item;
    }

    if (item.match("主　　演")){
        movie.actors = item;   
    }

    if (item.match("简　　介")){
        movie.introduction = item;
    }

}

export {
    flyController,
    moviesController,
}