import { Response, Request, NextFunction } from "express"
import { collections } from "../db/db"
import bcrypt from "bcrypt"
import user from "../models/user"
import passport from "passport"
import { ObjectId } from "mongodb"

export const postSignup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// hash password for safe storage
	const hashedPassword = await bcrypt.hash(req.body.password, 10)

	// if cart exists in this session, we want to insert it to the brand new user in DB,
	// this behavior will be forced in placing order logic

	let newCart = req.session.cart ? req.session.cart : null

	// check if user with given email exists, insert it if doesnt

	if (user) {
		try {
			const exists = await collections.users?.findOne({ email: req.body.email })
			if (exists)
				return res.status(400).send("Account for this email already exists!")

			// create user object that we want to insert into DB

			const user: user = {
				email: req.body.email,
				password: hashedPassword,
				cart: newCart,
			}
			await collections.users?.insertOne(user)

			// after succesfull registering user, redirect to login page

			return res.redirect("/api/login")
		} catch (err) {
			// if error return error status
			return res.status(400).send("Something went wrong!")
		}
	}
	// if error return error status
	else
		return res
			.status(400)
			.send("Couln't add a new user, please try again later!")
}
export const postLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// basically all we are doing here is running passport authenticate function,
	// which runs Our localStrategy, and all the passport stuff

	if (req.isAuthenticated()) return res.send("You are already logged in")
	passport.authenticate("local", function (err, user, info) {
		if (err) {
			return res.status(400).send("Some error occured!")
		}
		if (!user) {
			return res.send("Not valid info!")
		}
		req.logIn(user, function (err) {
			if (err) {
				return res.status(400).send("Some error occured!")
			}
			return res.send(user.email)
		})
	})(req, res, next)
}
export const postChangePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// there gonna be a form with 2 values, newPassword, and RepeatNewPassword
	// since user is already logged in i dont know if theres a need to fetch oldPassword, and check it
	let { newPassword, repeatNewPassword } = req.body
	if (newPassword === repeatNewPassword && req.user) {
		// hash new password
		newPassword = await bcrypt.hash(newPassword, 10)

		// change password in database
		try {
			await collections.users?.updateOne(
				{ _id: new ObjectId(req.user._id) },
				{ $set: { password: newPassword } }
			)
			return res.send("Succesfully edited password.")
		} catch (err) {
			return res.status(400).send("Some error occured!")
		}
	}
}
export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// since user is logged in, we are not gonna check anything,
	// just get user by req.user._id, and delete record in database
	// after implementing cart system, gonna change this controller a little bit
	if (req.user?._id) {
		try {
			await collections.users?.deleteOne({ _id: req.user._id })
			return res.redirect("/")
		} catch (err) {
			return res.status(400).send("Some error occured!")
		}
	}
}
