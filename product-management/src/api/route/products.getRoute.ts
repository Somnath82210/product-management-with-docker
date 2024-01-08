import {
    getProductController, 
    productRecycleBinController, 
    topProductController,
    viewProductController,
    countProductController 
} from "../controllers/products.controller";
import express from "express";
import { validation,tokenCheck } from "../../middleware/validation";
let routes = express.Router();

routes.get('/getproduct',tokenCheck,getProductController);
routes.get('/viewproduct?:id',tokenCheck, viewProductController);
routes.get('/topproducts', tokenCheck, topProductController);
routes.get('/recyclebin', tokenCheck, productRecycleBinController);
routes.get('/allcounts', tokenCheck, countProductController)
export default routes;
