import express, { Router } from 'express'
export const userroutes:Router=express.Router()
userroutes.post("/signup",(req,res)=>{
    //signup logic here
})
userroutes.post("/signin",(req,res)=>{
    //signin logic here
})
userroutes.put("/changepassword",(req,res)=>{
    //changing password logic
})
userroutes.post("/details",(req,res)=>{
    // description and techstack logic 
    //***should merge with signup endpoint or change the db */
})
userroutes.get("/profile",(req,res)=>{
    //see user profile
})
userroutes.post("/upload_resume",(req,res)=>{
    //multer logic to upload resume
})
userroutes.put("/profile/update",(req,res)=>{
    //logic to change the resume pdf
})
userroutes.get("/jobs",(req,res)=>{
    //get all the jobs for the dashboard
})
userroutes.post("/apply",(req,res)=>{
    // probalby shouldnt be a post endpoint idk
    //logic to apply
})
userroutes.get("/applied",(req,res)=>{
    //get all the jobs i have applied for
})