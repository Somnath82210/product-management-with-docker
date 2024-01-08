import express from 'express';
import getRouter from '../api/route/products.getRoute';
import postRouter from '../api/route/products.postRoute';
import putRouter from '../api/route/products.putRoute';
let routes = express.Router();

routes.use('/',getRouter, postRouter,putRouter);

export default routes;