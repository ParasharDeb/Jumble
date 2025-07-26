import express, { Router } from 'express'
import { middleware } from './middleware'
import { SignupSchema } from './types'
import { prismaclient } from '@repo/db/client'
export const userroutes:Router=express.Router()
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
    // need logic to convert the resume pdf to link
    await prismaclient.user.create({
        data:{
            email:parseddata.data.email,
            password:parseddata.data.password,
            username:parseddata.data.username,
            resumeUrl:parseddata.data.resume,
            portfolio:parseddata.data.portfolio
        }
    })
})
userroutes.post("/signin",(req,res)=>{
    //signin logic here
})
userroutes.put("/changepassword",middleware,(req,res)=>{
    //changing password logic
})
// userroutes.post("/details",middleware,(req,res)=>{
//     // description and techstack logic 
//     //***should merge with signup endpoint or change the db */
// })
userroutes.get("/profile",middleware,(req,res)=>{
    //see user profile
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