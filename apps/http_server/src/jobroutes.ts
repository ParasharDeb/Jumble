import express, { Router } from 'express'
import puppeteer from 'puppeteer';
import { authmiddleware } from './middleware';
import { ExternalJob } from './types';
import { prismaclient } from '@repo/db/client';
import axios from 'axios';
import { FormattedJob } from './types';
export const jobroutes:Router=express.Router()
interface Authrequest extends Request{
    userId:number
}
jobroutes.get("/jobs",authmiddleware,async(req,res)=>{
    const userId=(req as unknown as Authrequest).userId;
    if(!userId){
        res.json("you are not signed in")
    }

    const response = await axios.get("https://www.arbeitnow.com/api/job-board-api")

    const jobsdata=response.data.data;

    const formattedJobs = jobsdata.filter((job: ExternalJob) => job.title && job.company_name && job.url) 
    .map((job: ExternalJob): FormattedJob => ({
      title: job.title,
      company: job.company_name,
      location: job.location,
      isRemote: job.remote,
      applyUrl: job.url,
      tags: job.tags,
      datePosted: job.created_at 
    }))

    res.json(formattedJobs)
})
jobroutes.post("/apply",authmiddleware,async(req,res)=>{
    const userId=(req as unknown as Authrequest).userId;
    if(!userId){
        res.json({
            message:"you are not signed in"
        })
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.body.url);//need to find a way to get the url from the job object in the above endpoint

    const user=await prismaclient.user.findFirst({
        where:{
            id:userId
        }
    })
    if(!user){  
        res.json({
            message:"user not found"
        })
        return
    }
    await page.type('input[name="name"]', user.username);
    await page.type('input[name="email"]', user.email);
    const fileInput = await page.$('input[type="file"]');
    //need to fix this
    // await fileInput.uploadFile('/path/to/resume.pdf');
    // await page.click('button[type="submit"]');
    // await browser.close();
    
})
jobroutes.get("/applied",authmiddleware,async(req,res)=>{
   const userId=(req as unknown as Authrequest).userId;
   if(!userId){
    res.json({
        message:"you are not signed in"
    })
    return
   }
   const data = await prismaclient.user.findMany({
    where:{
        id:userId
    }
   })
   res.json(data)
})