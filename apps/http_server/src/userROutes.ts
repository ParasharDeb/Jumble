import express, { Request, Router } from 'express'
import { middleware } from './middleware'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { SignupSchema, SinginSchema, updatePasswordSchema } from './types'
import { prismaclient } from '@repo/db/client'
import { JWT_SECRET } from '@repo/backend-common/config'
import { email } from 'zod'
export const userroutes:Router=express.Router()
interface Authrequest extends Request{
    userId:number
}
userroutes.post("/signup",async(req,res)=>{
    const parseddata=SignupSchema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"invalid credentials"
        })
        return
    }
    const user=await prismaclient.user.findFirst({
        where:{
            email:parseddata.data.email
        }
    })
    if(user){
        res.json({
            message:"email already exists"
        })
        return
    } 
    const hashedpaasword=await bcrypt.hash(parseddata.data.password,10)
    //TODO:need logic to convert the resume pdf to link
    await prismaclient.user.create({
        data:{
            email:parseddata.data.email,
            password:hashedpaasword,
            username:parseddata.data.username,
            resumeUrl:parseddata.data.resume,
            portfolio:parseddata.data.portfolio
        }
    })
})
userroutes.post("/signin",async(req,res)=>{
    const parseddata=SinginSchema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"invalid input"
        })
        return
    }
    const user =await prismaclient.user.findFirst({
        where:{
            email:parseddata.data.email
        }
    })
    if(!user){
        res.json({
            message:"incorrect email"
        })
        return
    }
    const correctpass=await bcrypt.compare(user.password,parseddata.data.password);
    if(!correctpass){
        res.json({
            message:"incorrect password"
        })
        return
    }
    const token = jwt.sign({
        userId:user.id
    },JWT_SECRET)
    res.json({
        token:token
    })
})

userroutes.put("/changepassword",middleware,async(req,res)=>{
    const userId= (req as Authrequest).userId 
    const parseddata=updatePasswordSchema.safeParse(req.body);
    if(!parseddata.success){
        res.json({
            message:"invalid input"
        })
        return
    }
    if(!userId){
        res.json({
            message:"you are not signed in"
        })
    }
    const user = await prismaclient.user.findFirst({
        where:{
            id:userId
        }
    })
    if(!user ){
        res.json({
            message:"cannot find the user" // probably should have a better message
        })
        return
    }
    const isMatch=await bcrypt.compare(parseddata.data.oldpassword,user?.password)
    if(!isMatch){
        res.json({
            message:"incorrect password"
        })
        return
    }
    const hashedpaasword=await bcrypt.hash(parseddata.data.newpassword,10)
    try{
        await prismaclient.user.update({
        data:{password:hashedpaasword},
        where:{id:userId}
        })
        res.json({
            message:"you have succesfully changed the password"
        })
    }   
    catch(e){
        res.json(e)
    }
})
// userroutes.post("/details",middleware,(req,res)=>{
//     // description and techstack logic 
//     //***should merge with signup endpoint or change the db */
// })
userroutes.get("/profile",middleware,async(req,res)=>{
    const userId=(req as Authrequest).userId    
    if(!userId){
        res.json({
            message:"Unauthorized"
        })
        return
    }
    const user = await prismaclient.user.findFirst({
        where:{
            id:userId
        }
    })
    if(!user){
        res.json({
            message:"You are not Signed in"
        })
    }
    res.json({
        username:user?.username,
        email:user?.email,
        portfolio:user?.portfolio
        //TODO: SHOULD ALSO HAVE THE PROJECTS SHOWING OPTION NEED TO FIGURE THAT OUT SOMEHOW
    })
})
userroutes.post("/upload_resume",middleware,(req,res)=>{
    //multer logic to upload resume
})
userroutes.put("/profile/update",middleware,(req,res)=>{
    //logic to change the resume pdf
})
userroutes.get("/jobs",middleware,(req,res)=>{
    //get all the jobs for the dashboard
})
userroutes.post("/apply",middleware,(req,res)=>{
    // probalby shouldnt be a post endpoint idk
    //logic to apply
})
userroutes.get("/applied",middleware,(req,res)=>{
    //get all the jobs i have applied for
})