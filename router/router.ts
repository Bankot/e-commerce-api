import express, { NextFunction, Response, Request } from "express"
import { body } from "express-validator"
import * as userController from "../controllers/userController"
import authenticationMiddleware from "../middleware/authMiddleware"
import validatorHandler from "../middleware/validatorHandler"

const router = express.Router()

// this router looks messy, its first time im using express-validator and im satisfied with utilities
// its providing, but code looks a bit ugly :(

router
	.route("/register")
	.post(
		[
			body("email")
				.trim() // remove empty spaces
				.normalizeEmail()
				.toLowerCase()
				.isEmail()
				.withMessage("Please provide valid email"), // error message
			body("password")
				.trim() // remove empty spaces
				.isLength({ min: 5 })
				.withMessage("Password must be at least 5 characters long!"), // error message
			body("rpassword").custom((value, { req }) => {
				if (value === req.body?.password) return true
				else throw new Error("Passwords aren't the same!")
			}),
		],
		validatorHandler, // this middleware is just passing error messages into next function
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
				.trim() // remove empty spaces
				.normalizeEmail()
				.toLowerCase()
				.isEmail()
				.withMessage("Please provide valid email"), // error message
			body("password")
				.trim()
				.isLength({ min: 5 })
				.withMessage("Password must be at least 5 characters long!"), // error message
		],
		validatorHandler, // passing error messages into next fn
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
router.route("/changePassword").post(
	[
		body("newPassword")
			.trim()
			.isLength({ min: 5 })
			.withMessage("You have to inser password!"),
		body("repeatNewPassword").custom((value, { req }) => {
			if (value === req.body?.newPassword) return true
			else throw new Error("Passwords aren't the same!")
		}),
	],
	validatorHandler,
	authenticationMiddleware,
	userController.postChangePassword
)
router
	.route("/user")
	.delete(authenticationMiddleware, userController.deleteUser)
router.route("/logout").get((req, res, next) => {
	req.logout((err) => console.log(err))
	res.redirect("/api/login")
})
export default router
