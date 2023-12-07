import dotenv from 'dotenv'
import { prismaProductUrl, prismaUserDataUrl, prismaKycUrl } from "../db/connect";
import { stringToBool } from '../utils/helpers';
import { tokenVerify } from "../utils/authVerify";
import { ObjectId } from 'mongodb';
dotenv.config()

export function addProductService(data: any, file: any, token: string, id: string) {
    return new Promise(async (resolve, reject) => {
        try {
            let verified: any = await tokenVerify(token);
            //find user if he/she is active or inactive
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
                //calculating total number
                let total = Number(data.productQty) * Number(data.productPrice)
                //converting string values into boolean
                if (typeof data.cancellable === 'string') data.cancellable = stringToBool(data.cancellable);
                if (typeof data.returnable === 'string') data.returnable = stringToBool(data.returnable);
                if (typeof data.refund === 'string') data.refund = stringToBool(data.refund);
                if (typeof data.storage === 'string') data.storage = stringToBool(data.storage);
                if (typeof data.publish === 'string') data.publish = stringToBool(data.publish);
                //if user is admin
                if (userData[0].isAdmin === true && id) {
                    //if user is admin, userid will be query id, not from token
                    await prismaProductUrl.products.create({
                        data: {
                            "productName": data.productName,
                            "productDescription": data.productDescription,
                            "productQty": Number(data.productQty),
                            "productPrice": Number(data.productPrice),
                            "productPhoto": (file && file.length > 0) ? file[0].path : "N/A",
                            "packageWeight": Number(data.packageWeight),
                            "cancellable": data.cancellable,
                            "returnable": data.returnable,
                            "totalPrice": total,
                            "brand": data.brand,
                            "refund": data.refund,
                            "hsn_sac": data.hsn_sac,
                            "mrp": Number(data.mrp),
                            "tax": data.tax,
                            "publish": data.publish,
                            "ean": data.ean,
                            "brandOwnerName": data.brandOwnerName,
                            "brandOwnerAddress": data.brandOwnerAddress,
                            "expiryDate_bestBeforeUse": data.expiryDate_bestBeforeUse,
                            "batchNumber": Number(data.batchNumber),
                            "handling_instructions": data.handling_instructions,
                            "storage": data.storage,
                            "storageCondition": data.storageCondition,
                            "timeToShip": data.timeToShip,
                            "userId": id,
                        }
                    }).then(async (res: any) => {
                        console.log("product created");
                        //updating ondc data
                        await prismaKycUrl.ondc.updateMany({
                            where: {
                                productId: res.id,
                            }, data: {
                                timeToShip: data.timeToShip,
                                cancellable: data.cancellable,
                                returnable: data.returnable,
                            }
                        })
                        resolve({ status: true, message: "product added", data: { productId: res.id, productName: res.productName, productPrice: Number(res.productPrice), qty: Number(res.productQty) } });
                    })
                } else if (userData[0].isAdmin === true && !id){
                    resolve({status:false, message:"please provide id"})
                }
                //if user is not an admin
                await prismaProductUrl.products.create({
                    data: {
                        "productName": data.productName,
                        "productDescription": data.productDescription,
                        "productQty": Number(data.productQty),
                        "productPrice": Number(data.productPrice),
                        "productPhoto": (file && file.length > 0) ? file[0].path : "N/A",
                        "packageWeight": Number(data.packageWeight),
                        "cancellable": data.cancellable,
                        "returnable": data.returnable,
                        "totalPrice": total,
                        "brand": data.brand,
                        "refund": data.refund,
                        "hsn_sac": data.hsn_sac,
                        "mrp": Number(data.mrp),
                        "tax": data.tax,
                        "publish": data.publish,
                        "ean": data.ean,
                        "brandOwnerName": data.brandOwnerName,
                        "brandOwnerAddress": data.brandOwnerAddress,
                        "expiryDate_bestBeforeUse": data.expiryDate_bestBeforeUse,
                        "batchNumber": Number(data.batchNumber),
                        "handling_instructions": data.handling_instructions,
                        "storage": data.storage,
                        "storageCondition": data.storageCondition,
                        "timeToShip": data.timeToShip,
                        "userId": verified.data.id,
                    }
                }).then(async (res: any) => {
                    console.log("product created");
                    //updating ondc data
                    await prismaKycUrl.ondc.updateMany({
                        where: {
                            productId: res.id,
                        }, data: {
                            timeToShip: data.timeToShip,
                            cancellable: data.cancellable,
                            returnable: data.returnable,
                        }
                    })
                    resolve({ status: true, message: "product added", data: { productId: res.id, productName: res.productName, productPrice: Number(res.productPrice), qty: Number(res.productQty) } });
                })
            } else {
                resolve({ status: false, message: "no user found" })
            }
        } catch (error) {
            console.log("error from service", error);
            reject({ status: false, message: "error from service" })
        }
    })
}

export function getProductsService(token: string, id: string) {
    return new Promise(async (resolve, reject) => {
        try {
            let verified: any = await tokenVerify(token);
            //find user if he/she is active or inactive
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
                if (id && userData[0].isAdmin === true) {
                    await prismaProductUrl.products.findMany({
                        where: {
                            userId: id,
                            statusCode: 0
                        }, select: {
                            id: true,
                            productName: true,
                            productQty: true,
                            productPrice: true,
                            adminApprove: true
                        }
                    }).then((res: any) => {
                        if (res.length > 0) {
                            resolve({ status: true, message: "product list", data: res })
                        }
                        resolve({ status: false, message: "user has no products" })
                    }).catch((err: any) => {
                        resolve({ status: false, message: "error in get", data: err.name })
                    })
                } else if (id && userData[0].isAdmin === false) {
                    resolve({ status: false, message: "not authorized to see list" })
                }
                await prismaProductUrl.products.findMany({
                    where: {
                        userId: verified.data.id,
                        statusCode: 0
                    }, select: {
                        id: true,
                        productName: true,
                        productQty: true,
                        productPrice: true,
                        adminApprove: true,
                        totalPrice:true
                    }
                }).then((res: any) => {
                    if (res.length > 0) {
                        resolve({ status: true, message: "product list", data: res })
                    }
                    resolve({ status: false, message: "user has no products" })
                }).catch((err: any) => {
                    resolve({ status: false, message: "error in get", data: err.name })
                })
            } else {
                resolve({ status: false, message: "no user found" })
            }
        } catch (error) {
            console.log("internal server error", error);
            reject({ status: false, message: "internal server error" })
        }
    })
}

export function updateProductService(token: string, file: any, id: any, data: any) {
    return new Promise(async (resolve, reject) => {
        try {
            let verified: any = await tokenVerify(token);
            //find user if he/she is active or inactive
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
                //calaculating total number
                let total = Number(data.productQty) * Number(data.productPrice)
                //converting string values into boolean
                if (typeof data.cancellable === 'string') data.cancellable = stringToBool(data.cancellable);
                if (typeof data.returnable === 'string') data.returnable = stringToBool(data.returnable);
                if (typeof data.refund === 'string') data.refund = stringToBool(data.refund);
                if (typeof data.publish === 'string') data.publish = stringToBool(data.publish);
                if (typeof data.storage === 'string') data.storage = stringToBool(data.storage);
                //find by product id
                await prismaProductUrl.products.update({
                    where: {
                        id: id,
                        statusCode: 0
                    }, data: {
                        "productName": data.productName,
                        "productDescription": data.productDescription,
                        "productQty": Number(data.productQty),
                        "productPrice": Number(data.productPrice),
                        "productPhoto": (file && file.length > 0) ? file[0].path : "N/A",
                        "packageWeight": Number(data.packageWeight),
                        "cancellable": data.cancellable,
                        "returnable": data.returnable,
                        "totalPrice": total,
                        "brand": data.brand,
                        "refund": data.refund,
                        "hsn_sac": data.hsn_sac,
                        "mrp": Number(data.mrp),
                        "tax": data.tax,
                        "publish": data.publish,
                        "ean": data.ean,
                        "brandOwnerName": data.brandOwnerName,
                        "brandOwnerAddress": data.brandOwnerAddress,
                        "expiryDate_bestBeforeUse": data.expiryDate_bestBeforeUse,
                        "batchNumber": Number(data.batchNumber),
                        "handling_instructions": data.handling_instructions,
                        "storage": data.storage,
                        "storageCondition": data.storageCondition,
                        "timeToShip": data.timeToShip
                    }
                }).then(async (res: any) => {
                    if (Object.keys(res).length > 0) {
                        await prismaKycUrl.ondc.updateMany({
                            where: {
                                productId: res.id,
                            }, data: {
                                timeToShip: data.timeToShip,
                                cancellable: data.cancellable,
                                returnable: data.returnable,
                            }
                        })
                        resolve({ status: true, message: "product updated", data: id })
                    } else {
                        resolve({ status: false, message: "no product found" })
                    }
                }).catch((er: any) => {
                    console.log(er)
                    resolve({ status: false, message: "no product exist", data: er.name })
                })
            } else {
                resolve({ status: false, message: "no user found" })
            }
        } catch (error) {
            console.log("internal server error", error);
            reject({ status: false, message: "internal server error" })
        }
    })
}

export function deleteProductService(token: string, id: any) {
    return new Promise(async (resolve, reject) => {
        try {
            let verified: any = await tokenVerify(token);
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
                //find product by product id and update code
                await prismaProductUrl.products.update({
                    where: {
                        id: id,
                        statusCode: 0
                    }, data: {
                        statusCode: 1
                    }
                }).then((res: any) => {
                    if (Object.keys(res).length > 0) {
                        resolve({ status: true, message: "product deleted", data: res.id })
                    } else {
                        resolve({ status: false, message: "no product found" })
                    }
                }).catch((er: any) => {
                    console.log(er)
                    resolve({ status: false, message: "no product exist", data: er.name })
                })
            } else {
                resolve({ status: false, message: "no user found" })
            }
        } catch (error) {
            console.log("internal server error", error);
            reject({ status: false, message: "internal server error" })
        }
    })
}

export function viewProductService(token: string, id: string) {
    return new Promise(async (resolve, reject) => {
        try {
            let verified: any = await tokenVerify(token);
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
                //find product details by id
                prismaProductUrl.products.findMany({
                    where: {
                        id: id,
                        statusCode: 0
                    }, select: {
                        id: true,
                        productName: true,
                        productDescription: true,
                        productQty: true,
                        productPrice: true,
                        productPhoto: true,
                        packageWeight: true,
                        cancellable: true,
                        returnable: true,
                        totalPrice: true,
                        brand: true,
                        refund: true,
                        tax: true,
                        hsn_sac: true,
                        handling_instructions: true,
                        publish: true,
                        ean: true,
                        adminApprove: true,
                        brandOwnerName: true,
                        brandOwnerAddress: true,
                        expiryDate_bestBeforeUse: true,
                        batchNumber: true,
                        storage: true,
                        storageCondition: true,
                        mrp: true
                    }
                }).then((res: any) => {
                    if (res.length > 0) {
                        resolve({ status: true, message: "view product", data: res[0] })
                    }
                    resolve({ status: false, message: "no product found" })
                }).catch((err: any) => {
                    console.log("error from find", err)
                    resolve({ status: false, message: "error in data" })
                })
            } else {
                resolve({ status: false, message: "no user found" })
            }
        } catch (error) {
            console.log("internal server error", error);
            reject({ status: false, message: "internal server error" })
        }
    })
}

export function topProductService(token: string, id:string) {
    return new Promise(async (resolve, reject) => {
        try {
            let verified: any = await tokenVerify(token);
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            });
            if (userData.length > 0) {
                await prismaProductUrl.products.findMany({
                    take:3,
                    where:{
                     userId:verified.data.id,
                     statusCode:0
                    },
                    orderBy: {
                        productPrice: 'desc'
                    }, select:{
                        productName:true,
                        id: true,
                    }
                }).then((res:any)=>{
                    if(res.length>0){
                        //resolve({status:true, message:"top products", topProduct: res[0], secondProduct: res[1], thirdProduct:res[2]})
                        resolve({status:true, message:"top products", topProduct: res[0].productName,topProductId: res[0].id, secondProduct: res[1].productName, secondProductId: res[1].id ,thirdProduct:res[2].productName,thirdProductId:res[2].id})
                    } else {
                        resolve({status:false, message:"no user or product found"})
                    }
                })
            } else {
                resolve({status:false, message:"no user found"})
            }
        } catch (error) {
            console.log("internal server error", error);
            reject({ status: false, message: "internal server error" })
        }
    })
}

export function productRecycleBinService(token:string){
    return new Promise(async (resolve, reject)=>{
        try {
            let verified: any = await tokenVerify(token);
            //find user if he/she is active or inactive
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
            await prismaProductUrl.products.findMany({
                where: {
                    userId: verified.data.id,
                    statusCode: 1
                }, select: {
                    id: true,
                    productName: true,
                    productQty: true,
                    productPrice: true,
                    adminApprove: true
                }
            }).then((res: any) => {
                if (res.length > 0) {
                    console.log(res)
                    resolve({ status: true, message: "recycled product list", data: res })
                }
                resolve({ status: false, message: "no products in bin" })
            }).catch((err: any) => {
                resolve({ status: false, message: "error in get", data: err.name })
            })
        } else {
            resolve({status:false, message:"no user found"})
        }
      } catch (error) {
        console.log("internal server error", error);
        reject({ status: false, message: "internal server error" })
}
    })
}

export function restoreProductService(token:string,id:string){
    return new Promise(async (resolve, reject)=>{
        try {
            let verified: any = await tokenVerify(token);
            //find user if he/she is active or inactive
            let userData = await prismaUserDataUrl.user.findMany({
                where: {
                    id: verified.data.id,
                    statusCode: 0
                }, select: {
                    isAdmin: true,
                    adminLevel: true
                }
            })
            if (userData.length > 0) {
            await prismaProductUrl.products.update({
                where: {
                    id: id,
                    statusCode: 1
                }, data:{
                    statusCode:0
                }
            }).then((res: any) => {
                if (res.length > 0) {
                    console.log(res)
                    resolve({ status: true, message: "product restored", data: id })
                }
                resolve({ status: false, message: "no products in bin" })
            }).catch((err: any) => {
                resolve({ status: false, message: "error in get", data: err.name })
            })
        } else {
            resolve({status:false, message:"no user found"})
        }
      } catch (error) {
        console.log("internal server error", error);
        reject({ status: false, message: "internal server error" })
}
    })
}