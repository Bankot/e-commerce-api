import LocalStrategy from "passport-local"
import passport from "passport"
import bcrypt from 'bcrypt'
import { NextFunction } from "express";

passport.use("local", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    const user = await db.collection("users").findOne({email: email })

    try{
        // check if theres an record for given email
        if(!user) return done(undefined, false, {message: `User with email: ${email} doesn't exist!`})
        // if theres a user linked to that email, then check if given password matches
        // it does, so lets fire done with user object
        if(bcrypt.compare(password, user.password)) return done(undefined, user)
        // it doesnt, so lets throw an error 
        return done(undefined, false, {message: `Password is incorrect.`})
        
    }catch(err) {
        // also if theres an error with database, run done function with that error 
        return done(err)
    }
}));

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if ((<any>req).isAuthenticated()) {
        return next();
    }
    (<any>res).redirect("/login");
};
