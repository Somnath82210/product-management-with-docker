import { Request, Response } from "express";
import { addProductService,deleteProductService,getProductsService, productRecycleBinService, restoreProductService, topProductService, updateProductService, viewProductService } from "../../services/products.services";
import statusCode from "../../utils/statusCode";
import ErrorHandler from "../../utils/errorHandler";
import asynErr from '../../utils/asyncErr'

export const addProductController = asynErr(async (req:Request, res:Response)=>{
    let token = req.headers.authorization as string;
    let data:object= req.body
    let file= req.files;
    let id :any = req.query.id;
    let services: any = await addProductService(data,file,token,id);
    if(services.status===true){
           res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
    } else if (services.status === false) {
           res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message })
    } else {
           throw new ErrorHandler(
                  "internal server error",
                  statusCode.INTERNALSERVERERROR
           );
    }  
})

export const getProductController = asynErr(async (req:Request, res:Response)=>{
    let token = req.headers.authorization as string;
    let id :any = req.query.id;
    let services: any = await getProductsService(token,id);
    
    if(services.status===true){
           res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
    } else if (services.status === false) {
           res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message, data:services.data })
    } else {
           throw new ErrorHandler(
                  "internal server error",
                  statusCode.INTERNALSERVERERROR
           );
    }  
})

export const updateProductController = asynErr(async(req:Request, res:Response)=>{
       let token = req.headers.authorization as string;
       let id =  req.query.id as string;
       let data = req.body;
       let file = req.files;
       let services: any = await updateProductService(token,file,id,data);
       if(services.status===true){
              res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
       } else if (services.status === false) {
              res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message, data:services.data })
       } else {
              throw new ErrorHandler(
                     "internal server error",
                     statusCode.INTERNALSERVERERROR
              );
       } 
})
export const viewProductController = asynErr(async(req:Request, res:Response)=>{
       let token = req.headers.authorization as string;
       let id =  req.query.id as string;
       let services: any = await viewProductService(token,id);
       if(services.status===true){
              res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
       } else if (services.status === false) {
              res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message, data:services.data })
       } else {
              throw new ErrorHandler(
                     "internal server error",
                     statusCode.INTERNALSERVERERROR
              );
       } 
})

export const deleteProductController = asynErr(async(req:Request, res:Response)=>{
       let token = req.headers.authorization as string;
       let id =  req.query.id as string;
       let services: any = await deleteProductService(token,id);
       if(services.status===true){
              res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
       } else if (services.status === false) {
              res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message, data:services.data })
       } else {
              throw new ErrorHandler(
                     "internal server error",
                     statusCode.INTERNALSERVERERROR
              );
       } 
})

export const topProductController = asynErr(async(req:Request, res:Response)=>{
       let token = req.headers.authorization as string;
       let id =  req.query.id as string;
       let services: any = await topProductService(token,id);
       if(services.status===true){
              res.status(statusCode.OK).json({success:true, message:services.message,topProduct:services.topProduct, topProductId:services.topProductId, secondProduct:services.secondProduct, secondProductId:services.secondProductId,thirdProduct:services.thirdProduct, thirdProductId:services.thirdProductId})
       } else if (services.status === false) {
              res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message, data:services.data })
       } else {
              throw new ErrorHandler(
                     "internal server error",
                     statusCode.INTERNALSERVERERROR
              );
       } 
})


export const productRecycleBinController = asynErr(async(req:Request, res:Response)=>{
       let token = req.headers.authorization as string;
       let services: any = await productRecycleBinService(token);
       if(services.status===true){
              res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
       } else if (services.status === false) {
              res.status(statusCode.UNAUTHORIZED).json({ success: false, error: services.message, data:services.data })
       } else {
              throw new ErrorHandler(
                     "internal server error",
                     statusCode.INTERNALSERVERERROR
              );
       } 
}) 

export const restoreProductController = asynErr(async(req:Request, res:Response)=>{
       let token = req.headers.authorization as string;
       let id =  req.query.id as string;
       let services: any = await restoreProductService(token,id);
       if(services.status===true){
              res.status(statusCode.OK).json({success:true, message:services.message,data:services.data})
       } else if (services.status === false) {
              res.status(statusCode.NOITEM).json({ success: false, error: services.message, data:services.data })
       } else {
              throw new ErrorHandler(
                     "internal server error",
                     statusCode.INTERNALSERVERERROR
              );
       } 
}) 