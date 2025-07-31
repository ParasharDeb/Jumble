import { JWT_SECRET } from "./config";
import multer from "multer";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export function authmiddleware(req:AuthenticatedRequest,res:Response,next:NextFunction){
    const token=req.headers["authorization"]??" ";
    const decoded=jwt.verify(token,JWT_SECRET) as {userId : string}
    if (decoded){

        req.userId=decoded.userId
        next()
    }
    else{
        res.status(403).json({
            message:"user unauthorized"
        })
    }
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {        
    cb(null, file.originalname);
  }
});
export const upload = multer({ storage: storage });