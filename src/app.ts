import * as Koa from 'koa'
import * as mongoose from 'mongoose'
import * as Router from 'koa-router'
import {moviesRouter} from './Routers/moviesRouter'
import * as schedule from 'node-schedule'
import { flyController } from './Controllers/moviesControllers';

mongoose.connect("mongodb://localhost:27017/btMovie",err=>{
    if(!err){
        console.log('mongdb open success')
    }
})

const app = new Koa()

const router = new Router()
router.use('/movies',moviesRouter.routes(),moviesRouter.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())


function makeScheduleSpirder() {
    let rule = new schedule.RecurrenceRule
    rule.hour = 14
    rule.minute = 14
    rule.second = 0

    schedule.scheduleJob(rule,()=>{
        console.log(`开启 定时 爬虫 ${rule}`)
        flyController(null)
    }) 
}



app.listen(3000,()=>{
    makeScheduleSpirder()
    console.log("listen in 3000 ")
})

