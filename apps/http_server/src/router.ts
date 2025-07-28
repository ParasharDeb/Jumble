import express, { Router } from "express"
import { userroutes } from "./userROutes"
import { finderroutes } from "./finderRoutes"
export const allroutes:Router=express.Router()
allroutes.use("/user",userroutes)
allroutes.use("/find",finderroutes)