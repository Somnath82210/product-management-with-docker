import express from 'express';
import router from '../api/route/products.route';
let routes = express.Router();

routes.use('/',router);

export default routes;