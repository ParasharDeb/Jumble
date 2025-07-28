import express, { Router } from 'express'
export const finderroutes:Router=express.Router()
finderroutes.get("/linkedin",(req,res)=>{
    //get jobopenings from linkedin
})
finderroutes.get("/naukri",(req,res)=>{
    //get job opennnigs from naukri.com
})
finderroutes.get("/indeed",(req,res)=>{
    //get from indeed
})
finderroutes.get("/glassdoor",(req,res)=>{
    //get from glassdoor
})
finderroutes.get("/ziprecruiter",(req,res)=>{
    //from zip recruiter
})
finderroutes.get("/upwork",(req,res)=>{
    //get from upwrok
})
finderroutes.get("/internshala",(req,res)=>{
    //get from internshala
})