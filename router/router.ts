import express, { NextFunction } from "express"
import { body, validationResult } from "express-validator"
import { addProduct } from "../controllers/administratorController"
import * as userController from "../controllers/userController"
import authenticationMiddleware from "../middleware/authMiddleware"
import passport from "passport"
import validatorHandler from "../middleware/validatorHandler"

const router = express.Router()
router.route("/").get(authenticationMiddleware, (req, res, next) => {
	res.send("hello there!")
})
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

router.route("/register").post(
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
router.route("/login").post(
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
	userController.postLogin,
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	(req: any, res: any, next: any) => {
		res.json(req.user)
	}
)

export default router
