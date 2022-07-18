import { Response, Request, NextFunction } from "express";
import { collections } from "../db/db";
import { validationResult } from "express-validator";
import user from "../models/user";

export const postSignup = async (req: Request, res: Response, next: NextFunction) => {

    // results from express-validator

    const errors =  validationResult(req)
       
    if(!errors.isEmpty()) return res.json(errors)
    // create user object with type : user
    const user : user = {
        email: req.body.email,
        password: req.body.password
    }
    // check if user with given email exists, create it if doesnt
    if(user){
        const exists = await collections.users?.findOne({email: req.body.email})
        if(exists) return res.status(400).send("Account for this email already exists!")
        collections.users?.insertOne(user)
        // req.login()
        return res.send("succesfully added an user!")
    }else return res.status(400).send("Couln't add a new user, please try again later!")
}