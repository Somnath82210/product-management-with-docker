import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv';
dotenv.config()

let baseUrl = process.env.DATABASE_URL;
let kycUrl = baseUrl + "kycDatabase";
let userDataUrl = baseUrl + 'userDatabase';
let productUrl = baseUrl + 'productDatabase'
declare global {
    var prismaKycUrl: PrismaClient | undefined
    var prismaUserDataUrl: PrismaClient | undefined
    var prismaProductUrl: PrismaClient | undefined
}

const prismaKycUrl = globalThis.prismaKycUrl || new PrismaClient({ datasources: { db: { url: kycUrl } } });
const prismaUserDataUrl = globalThis.prismaUserDataUrl || new PrismaClient({ datasources: { db: { url: userDataUrl } } });
const prismaProductUrl = globalThis.prismaProductUrl || new PrismaClient({ datasources: { db: { url: productUrl } } });
if(process.env.NODE_ENV != 'production') {
    globalThis.prismaKycUrl = prismaKycUrl
    globalThis.prismaUserDataUrl = prismaUserDataUrl
    globalThis.prismaProductUrl = prismaProductUrl
}

export {prismaProductUrl, prismaKycUrl, prismaUserDataUrl}
