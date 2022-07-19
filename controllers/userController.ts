import { Response, Request, NextFunction } from "express";
import { collections } from "../db/db";
import bcrypt from "bcrypt"
import user from "../models/user";
import passport from "passport"
import { IVerifyOptions } from "passport-local";

export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user : user = {
        email: req.body.email,
        password: hashedPassword
    }
    // check if user with given email exists, create it if doesnt
    if(user){
        try{
        const exists = await collections.users?.findOne({email: req.body.email})
        if(exists) return res.status(400).send("Account for this email already exists!")
        collections.users?.insertOne(user)
        // after succesfull registering user, log him in

        passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
        (req : Request, res : Response) => {
          
            req.logIn(user, (err) => {

            if(err) return res.status(400).send("Couldn't login user!")
            
            return res.redirect("/")
          })
        };

        return res.send("succesfully added an user!")

        }catch(err) {return res.status(400).send("Something went wrong!")}
    }else return res.status(400).send("Couln't add a new user, please try again later!")
}
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
       const user = await collections.users?.findOne({email: req.body.email})
       if(user && (await bcrypt.compare(req.body.password, user.password))){

        passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
        (req : Request, res : Response) => {
            req.logIn(user, (err) => {
            if(err) return res.status(400).send("Couldn't login user!")
          })
        };
        
        next()
       }else return res.send("Invalid credentials.")
    }catch(err){
        return res.status(400).send("Something went wrong!")
    }
}