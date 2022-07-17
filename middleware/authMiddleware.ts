import { Response, Request, NextFunction } from "express";
import { validationResult, header } from "express-validator";
import jwt from "jsonwebtoken"

const isAuth = async (req: Request, res: Response, next: NextFunction) => {

   await header("authorization", "you have to be authorized!").not().isEmpty().run(req)
   const errors = validationResult(req);        
    if(!errors.isEmpty()){
        return res.redirect("/login")
    }
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")){
        const token = authHeader.split(" ")[1]
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const { _id, login } = decoded
		req.user = { _id, login }
		next()

    }else return res.redirect("/login")    
};
export default  isAuth