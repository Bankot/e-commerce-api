import { Response, Request, NextFunction } from "express"
import { collections } from "../db/db"
import bcrypt from "bcrypt"
import user from "../models/user"
import passport from "passport"

export const postSignup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10)
	const user: user = {
		email: req.body.email,
		password: hashedPassword,
	}
	// check if user with given email exists, create it if doesnt
	if (user) {
		try {
			const exists = await collections.users?.findOne({ email: req.body.email })
			if (exists)
				return res.status(400).send("Account for this email already exists!")

			await collections.users?.insertOne(user)
			// after succesfull registering user, log him in
			return res.redirect("/api/login")
		} catch (err) {
			return res.status(400).send("Something went wrong!")
		}
	} else
		return res
			.status(400)
			.send("Couln't add a new user, please try again later!")
}
export const postLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	passport.authenticate("local", function (err, user, info) {
		if (err) {
			return next(err)
		}
		if (!user) {
			return res.send("Not valid info!")
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err)
			}
			return res.send(user)
		})
	})(req, res, next)
}
