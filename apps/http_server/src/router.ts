import express, { Router } from "express"
import { userroutes } from "./userRoutes"
import { jobroutes } from "./jobroutes"

export const allroutes:Router=express.Router()
allroutes.use("/user",userroutes)
allroutes.use("/find",jobroutes)
