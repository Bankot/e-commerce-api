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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
	session({
		secret: secret,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			dbName: "ecommerce",
		}),
	})
)
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase()
	.then(() => app.use("/api", router))
	.catch((err) => console.log("Database Error!"))

app.listen(process.env.PORT, () =>
	console.log(`Listening on port ${process.env.PORT}...`)
)
