import * as Router from 'Koa-router'
import {flyController,moviesController} from '../Controllers/moviesControllers'
import { movies } from '../Model/movie';

const moviesRouter = new Router()
const flyRouter = new Router()


flyRouter.get('/fly',flyController)
flyRouter.get('/',moviesController)


moviesRouter.use(flyRouter.routes()).use(flyRouter.allowedMethods())

export {
    moviesRouter
}