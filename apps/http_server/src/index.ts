import express from 'express'
import cors from "cors"
import { allroutes } from './router'
const app=express()
app.use(cors())
app.use(express.json())
app.use("/api/v1",allroutes)
app.listen(3001)