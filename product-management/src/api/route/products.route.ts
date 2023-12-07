import { addProductController,deleteProductController,getProductController, productRecycleBinController, restoreProductController, topProductController, updateProductController, viewProductController } from "../controllers/products.controller";
import express from "express";
import multer from 'multer';
import { validation,tokenCheck } from "../../middleware/validation";
let routes = express.Router();

let upload = multer({dest:'public/uploads/'})

routes.post('/createproduct',tokenCheck,upload.any(),addProductController);
routes.get('/getproduct',tokenCheck,getProductController);
routes.put('/editproduct?:id',tokenCheck,upload.any(), updateProductController);
routes.get('/viewproduct?:id',tokenCheck, viewProductController);
routes.put('/deleteproduct?:id',tokenCheck,deleteProductController);
routes.get('/topproducts', tokenCheck, topProductController);
routes.get('/recyclebin', tokenCheck, productRecycleBinController);
routes.put('/restore?:id', tokenCheck, restoreProductController)
export default routes;
