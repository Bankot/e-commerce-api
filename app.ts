import express from "express"
import dotenv from "dotenv"
import isAuth from "./middleware/authMiddleware"
import { Response, Request, NextFunction } from "express";

dotenv.config()

const app = express()

app.get("/hello", isAuth, (req: Request, res: Response, next: NextFunction) => {
    console.log("rendering")
    res.send("hello")
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`))
