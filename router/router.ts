import express, { NextFunction, Response, Request } from "express"
import { body, validationResult } from "express-validator"
import { addProduct } from "../controllers/administratorController"
import * as userController from "../controllers/userController"
import authenticationMiddleware from "../middleware/authMiddleware"
import passport from "passport"
import validatorHandler from "../middleware/validatorHandler"

const router = express.Router()
router
	.route("/admin/addProduct")
	.post(
		[
			body("name")
				.exists({ checkNull: true, checkFalsy: true })
				.withMessage("Please provide a product name!"),
			body("price")
				.exists({ checkNull: true, checkFalsy: true })
				.withMessage("Please provide a product price!"),
			body("origin")
				.exists({ checkNull: true, checkFalsy: true })
				.withMessage("Please provide a product origin!"),
			body("quantity")
				.exists({ checkNull: true, checkFalsy: true })
				.withMessage("Please provide a product quantity!"),
		],
		validatorHandler,
		addProduct
	)

router
	.route("/register")
	.post(
		[
			body("email")
				.trim()
				.normalizeEmail()
				.toLowerCase()
				.isEmail()
				.withMessage("Please provide valid email"),
			body("password")
				.trim()
				.isLength({ min: 5 })
				.withMessage("Password must be at least 5 characters long!"),
			body("rpassword").custom((value, { req }) => {
				if (value === req.body?.password) return true
				else throw new Error("Passwords aren't the same!")
			}),
		],
		validatorHandler,
		userController.postSignup
	)
	.get((req: Request, res: Response, next: NextFunction) => {
		const form =
			'<h1>Register Page</h1><form method="post" action="/api/register">\
                    Enter Email:<br><input type="text" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
					<br>Repeat Password:<br><input type="password" name="rpassword">\
                    <br><br><input type="submit" value="Submit"></form>'

		res.send(form)
	})
router
	.route("/login")
	.post(
		[
			body("email")
				.trim()
				.normalizeEmail()
				.toLowerCase()
				.isEmail()
				.withMessage("Please provide valid email"),
			body("password")
				.trim()
				.isLength({ min: 5 })
				.withMessage("Password must be at least 5 characters long!"),
		],
		validatorHandler,
		userController.postLogin
	)
	.get((req: Request, res: Response, next: NextFunction) => {
		const form =
			'<h1>Login Page</h1><form method="POST" action="/api/login">\
    Enter Email:<br><input type="text" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>'

		res.send(form)
	})
router
	.route("/protected-route")
	.get(authenticationMiddleware, (req, res, next) => {
		res.send("hello there!")
	})
router.route("/userInfo").get((req, res, next) => {
	res.json(req.user)
})
router.route("/logout").get((req, res, next) => {
	req.logout((err) => console.log(err))
	res.redirect("/api/login")
})
export default router
