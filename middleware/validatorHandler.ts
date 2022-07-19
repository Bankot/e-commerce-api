import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

const validatorHandler =  (req: Request, res: Response, next: NextFunction) => {
    const errors =  validationResult(req)
       
    if(!errors.isEmpty()) return res.status(400).json(errors)
    next()
}

export default validatorHandler