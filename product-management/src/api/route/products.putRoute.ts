import { updateProductController,deleteProductController, restoreProductController} from "../controllers/products.controller";
import express from "express";
import multer from 'multer';
import { validation,tokenCheck } from "../../middleware/validation";
let routes = express.Router();

let upload = multer({dest:'public/uploads/'})

routes.put('/editproduct?:id',tokenCheck,upload.any(), updateProductController);
routes.put('/restore?:id', tokenCheck, restoreProductController);
routes.put('/deleteproduct?:id',tokenCheck,deleteProductController);
export default routes;