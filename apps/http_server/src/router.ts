import express, { Router } from "express"
import { userroutes } from "./user"
export const allroutes:Router=express.Router()
allroutes.use("/user",userroutes)
allroutes.use("/find",)