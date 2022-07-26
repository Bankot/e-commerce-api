import LocalStrategy from "passport-local"
import passport from "passport"
import bcrypt from "bcrypt"
import { collections } from "../db/db"
import { ObjectId } from "mongodb"
import user from "../models/user"

// setup local strategy (actually the only one we are gonna use)
passport.use(
	new LocalStrategy(
		// replace default username prop with email since we are gonna use email in our shop
		{ usernameField: "email" },
		async (email, password, done) => {
			try {
				// check if theres an record for given email
				const user = await collections.users?.findOne({ email: email })

				// if doesnt, lets send error message
				if (!user)
					return done(undefined, false, {
						message: `User with email: ${email} doesn't exist!`,
					})

				// if theres a user linked to that email, then check if given password matches
				// if it does, lets fire done with user object
				if (user && (await bcrypt.compare(password, user.password)))
					return done(undefined, user)

				//if password doen't match just call done with error message
				return done(undefined, false, { message: "Password is incorrect" })
			} catch (err) {
				// also if theres an error with database, run done function with that error
				return done(err)
			}
		}
	)
)
// this fn is saving user data to session,
// thats the place where you can determine which info are gonna be stored in session
passport.serializeUser((user: any, cb) => {
	cb(null, { email: user.email, _id: user._id })
})

//this fn takes userInfo from session, and fetches user by ID from MongoDB,
//when user is fetched, it adds user property to request object
passport.deserializeUser(async (user: user, cb) => {
	const result = await collections.users?.findOne(
		{
			_id: new ObjectId(user._id),
		},
		{ projection: { password: false } }
	)

	if (result) cb(null, result)
	else return cb(null, false)
})
export default passport
