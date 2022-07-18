import express from "express"
import { Response, Request, NextFunction } from "express";
import session from 'express-session'
import router from "./router/router"
import * as dotenv from 'dotenv' 
import { connectToDatabase } from "./db/db"
dotenv.config({path: ".env"})

const app = express()
const secret = process.env.SESSION_SECRET as string | string[]

app.use(express.json())

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}))
connectToDatabase().then(()=> app.use("/api", router)).catch(err=>console.log("Database Error!"))




app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`))
