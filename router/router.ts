import express, { NextFunction } from "express"
import { body, validationResult } from "express-validator"
import * as userController from "../controllers/userController"


const router = express.Router()

router.route("/register").post(
    [
        body("email").trim().normalizeEmail().toLowerCase().isEmail().withMessage("Please provide valid email"),
        body("password").trim().isLength({min: 5}).withMessage("Password must be at least 5 characters long!"),
        body("rpassword").custom((value, {req}) => {
            if(value === req.body?.password) return true
            else throw new Error("Passwords aren't the same!")
        })
    ], userController.postSignup
)
export default router