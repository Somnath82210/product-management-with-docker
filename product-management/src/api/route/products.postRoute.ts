import { addProductController, exportProductController} from "../controllers/products.controller";
import express from "express";
import multer from 'multer';
import { validation,tokenCheck } from "../../middleware/validation";
let routes = express.Router();

let upload = multer({dest:'public/uploads/'})

routes.post('/createproduct',tokenCheck,upload.any(),addProductController);
routes.post('/export', tokenCheck, exportProductController);

export default routes;