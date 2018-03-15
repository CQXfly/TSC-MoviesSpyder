"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const moviesControllers_1 = require("../Controllers/moviesControllers");
const moviesRouter = new Router();
exports.moviesRouter = moviesRouter;
const flyRouter = new Router();
flyRouter.get('/fly', moviesControllers_1.flyController);
flyRouter.get('/', moviesControllers_1.moviesController);
moviesRouter.use(flyRouter.routes()).use(flyRouter.allowedMethods());
//# sourceMappingURL=moviesRouter.js.map