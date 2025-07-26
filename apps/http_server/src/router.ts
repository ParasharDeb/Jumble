import express, { Router } from "express"
import { userroutes } from "./user"
import { finderroutes } from "./finder"
export const allroutes:Router=express.Router()
allroutes.use("/user",userroutes)
allroutes.use("/find",finderroutes)