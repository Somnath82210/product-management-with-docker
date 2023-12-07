import dotenv from 'dotenv'
import {Request,Response, NextFunction } from 'express'
dotenv.config()

export function validation(req:Request, res:Response, next:NextFunction){
    let data:any = req.body;
    if(Object.keys(data).length ==0 || data===null || typeof data===null || data===undefined || typeof data==='undefined' || !data){
      res.status(404).json({success:false, error:"empty input body"});
      return
    } else{
      next();
    }
}

export function tokenCheck (req:Request, res:Response, next:NextFunction){
    let token:any = req.headers.authorization;
    if (Object.keys(token).length ==0 || typeof token === 'undefined'|| token===null || token===undefined || typeof token===null || !token) {
        console.log("no token")
        res.status(404).json({ status: false, message: "no token" })
    } else {
        next()
      }
}