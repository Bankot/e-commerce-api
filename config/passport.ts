import LocalStrategy from "passport-local"
import passport from "passport"
import bcrypt from "bcrypt"
import { collections } from "../db/db"
import { ObjectId } from "mongodb"
import user from "../models/user"
passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			try {
				// check if theres an record for given email
				const user = await collections.users?.findOne({ email: email })

				// if doesnt, lets throw an error
				if (!user)
					return done(undefined, false, {
						message: `User with email: ${email} doesn't exist!`,
					})

				// if theres a user linked to that email, then check if given password matches
				// it does, so lets fire done with user object
				if (user && (await bcrypt.compare(password, user.password)))
					return done(undefined, { email: user.email, _id: user._id })

				//if password doen't match just call done with error
				return done(undefined, false, { message: "Password is incorrect" })
			} catch (err) {
				// also if theres an error with database, run done function with that error
				return done(err)
			}
		}
	)
)
passport.serializeUser((user, cb) => {
	cb(null, user)
})

passport.deserializeUser(async (user: user, cb) => {
	const result = await collections.users?.findOne(
		{
			_id: new ObjectId(user._id),
		},
		{ projection: { password: false } }
	)
	if (result) console.log(result)
	if (result) cb(null, result)
	else return cb(null, false)
})
export default passport
