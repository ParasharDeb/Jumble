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
        return
    }

    try {
        const { jobIndex } = req.body;
        
        if (jobIndex === undefined) {
            return res.status(400).json({ message: "Job index is required" });
        }

        // Fetch the jobs again to get the URL
        const response = await axios.get("https://www.arbeitnow.com/api/job-board-api")
        const jobsdata = response.data.data;
        const formattedJobs = jobsdata.filter((job: ExternalJob) => job.title && job.company_name && job.url) 
            .map((job: ExternalJob): FormattedJob => ({
                title: job.title,
                company: job.company_name,
                location: job.location,
                isRemote: job.remote,
                applyUrl: job.url,
                tags: job.tags,
                datePosted: job.created_at 
            }));

        if (jobIndex < 0 || jobIndex >= formattedJobs.length) {
            return res.status(400).json({ message: "Invalid job index" });
        }

        const selectedJob = formattedJobs[jobIndex];
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(selectedJob.applyUrl);

        const user = await prismaclient.user.findFirst({
            where: {
                id: userId
            }
        })
        
        if (!user) {  
            res.json({
                message: "user not found"
            })
            await browser.close();
            return
        }

        await page.type('input[name="firstname"]', user.firstname);
        await page.type('input[name="lastname"]', user.lastname)
        await page.type('input[name="email"]', user.email);
        await page.type('input[name="resume"]', user.resumeUrl);
        await page.type('input[name="LinkedIn"]', user.linkedIn)
        await page.type('input[name="Github"]', user.github)
        await page.type('input[name="location"]', user.location)
        await page.type('input[name="Phone Number"]', user.phoneNumber)

        await browser.close();
        
        res.json({
            message: "Application submitted successfully",
            job: selectedJob.title
        });

    } catch (error) {
        console.error('Error applying to job:', error);
        res.status(500).json({ message: "Failed to apply to job" });
    }
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