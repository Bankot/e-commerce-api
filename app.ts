import express from "express"
import passport from "./config/passport"
import session from "express-session"
import router from "./router/router"
import * as dotenv from "dotenv"
import { connectToDatabase } from "./db/db"
import MongoStore from "connect-mongo"
dotenv.config({ path: ".env" })

const app = express()
const secret = process.env.SESSION_SECRET as string | string[]

app.use(express.json()) // it makes req.body reading possible in POST requests
app.use(express.urlencoded({ extended: true })) // it helps express to recognize Request obj as a string or object

// for both of these middlewares you can use body-parser

app.use(
	session({
		secret: secret,
		resave: false, //when true it forces the session to be saved back to the session store,
		// even if the session was never modified during the request
		saveUninitialized: false, // when true it forces a session that is "uninitialized" to be saved to the store.
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			dbName: "ecommerce",
		}), // thats the session store initialized in MongoDB database
	})
)
app.use(passport.initialize()) // passport stuff initialize
app.use(passport.session()) // passport sessions initialize

connectToDatabase()
	.then(() => app.use("/api", router)) // im setting the routes when im sure DB is connected
	.catch((err) => console.log("Database Error!"))

app.listen(process.env.PORT, () =>
	console.log(`Listening on port ${process.env.PORT}...`)
)
