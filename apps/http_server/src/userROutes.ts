import express, { Request, Router } from 'express'
import bcrypt from 'bcrypt'
import * as fs from "fs"

import jwt from "jsonwebtoken"
import { SignupSchema, SinginSchema, updatePasswordSchema } from './types'
import { prismaclient } from '@repo/db/client'
import { JWT_SECRET } from './config'
import { authmiddleware, upload } from './middleware'
import { uploadCouldinary } from './cloudinary'

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
            phoneNumber:parseddata.data.phoneNumber,


            location:parseddata.data.location,

            
            linkedIn:parseddata.data.linkedIn,

            github:parseddata.data.github,
            consent:parseddata.data.consent
        }
    })
    res.json({
        message:"user created successfully"
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
    const correctpass=await bcrypt.compare(parseddata.data.password,user.password);
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

userroutes.put("/changepassword",authmiddleware,async(req,res)=>{
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
// userroutes.post("/details",authmiddleware,(req,res)=>{
//     // description and techstack logic 
//     //***should merge with signup endpoint or change the db */
// })
userroutes.get("/profile",authmiddleware,async(req,res)=>{
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
        },
        include: {
            projects: {
                include: {
                    techStacks: true
                }
            }
        }
    })
    if(!user){
        res.json({
            message:"You are not Signed in"
        })
        return
    }
    res.json({
        username:user?.username,
        email:user?.email,
        portfolio:user?.portfolio,
        resumeUrl:user?.resumeUrl,
        phoneNumber:user?.phoneNumber,
        location:user?.location,
        linkedIn:user?.linkedIn,
        github:user?.github,
        consent:user?.consent,
        projects: user?.projects
    })
})
userroutes.post('/upload_resume', authmiddleware, upload.single('resume'), async (req, res) => {
  const userId = (req as Authrequest).userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  console.log("File received:", {
    originalname: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  try {
    // Upload file to Cloudinary
    const cloudinaryResponse = await uploadCouldinary(req.file.path);
    
    if (!cloudinaryResponse) {
      console.error("Cloudinary upload failed - no response returned");
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }

    // Update user's resume URL in database
    await prismaclient.user.update({
      where: { id: userId },
      data: { resumeUrl: cloudinaryResponse.secure_url }
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: cloudinaryResponse.secure_url
    });

  } catch (error) {
    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: "Failed to upload resume",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

userroutes.post('/upload_portfolio', authmiddleware, upload.single('portfolio'), async (req, res) => {
  const userId = (req as Authrequest).userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  console.log("Portfolio file received:", {
    originalname: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  try {
    // Upload file to Cloudinary
    const cloudinaryResponse = await uploadCouldinary(req.file.path);
    
    if (!cloudinaryResponse) {
      console.error("Cloudinary upload failed - no response returned");
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }

    // Update user's portfolio URL in database
    await prismaclient.user.update({
      where: { id: userId },
      data: { portfolio: cloudinaryResponse.secure_url }
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Portfolio uploaded successfully",
      portfolioUrl: cloudinaryResponse.secure_url
    });

  } catch (error) {
    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Portfolio upload error:', error);
    res.status(500).json({ 
      message: "Failed to upload portfolio",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
