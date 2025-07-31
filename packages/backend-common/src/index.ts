import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
export const JWT_SECRET = process.env.JWT_SECRET || " ";
export const CLOUD_NAME= process.env.CLOUD_NAME || " ";
export const CLOUD_API_KEY = process.env.API_KEY || " ";
export const CLOUD_API_SECRET = process.env.API_SECRET || " ";