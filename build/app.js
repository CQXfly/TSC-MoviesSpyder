"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const mongoose = require("mongoose");
const Router = require("koa-router");
const moviesRouter_1 = require("./Routers/moviesRouter");
const schedule = require("node-schedule");
const moviesControllers_1 = require("./Controllers/moviesControllers");
mongoose.connect("mongodb://localhost:27017/btMovie", err => {
    if (!err) {
        console.log('mongdb open success');
    }
});
const app = new Koa();
const router = new Router();
router.use('/movies', moviesRouter_1.moviesRouter.routes(), moviesRouter_1.moviesRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());
function makeScheduleSpirder() {
    let rule = new schedule.RecurrenceRule;
    rule.hour = 14;
    rule.minute = 14;
    rule.second = 0;
    schedule.scheduleJob(rule, () => {
        console.log(`开启 定时 爬虫 ${rule}`);
        moviesControllers_1.flyController(null);
    });
}
app.listen(3000, () => {
    makeScheduleSpirder();
    console.log("listen in 3000 ");
});
//# sourceMappingURL=app.js.map