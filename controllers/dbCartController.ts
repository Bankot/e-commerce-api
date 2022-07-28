import { NextFunction, Request, Response } from "express"
import Cart from "../util/cart"
import { ObjectId } from "mongodb"
import { collections } from "../db/db"

// i feel like it could be built much better and smarter, gonna definitely try to improve it!

export const addToCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if there isn't any user logged in, skip this controller and go to next (session based cart)
	if (!req.user) return next()

	const { productId, quantity } = req.body
	let foundProduct: any = null
	try {
		// check if given ID of product is correct
		foundProduct = await collections.product?.findOne({
			_id: new ObjectId(productId),
		})
	} catch (err) {
		res.status(400).send(`Could't find product with id: ${productId}`)
	}
	// if theres no product that match to this call, send response with error
	if (!foundProduct) return res.status(400).send("Couldn't complete this call")

	// get user object

	let userFromDb: any = null
	await collections.users
		?.findOne({
			_id: new ObjectId(req.user._id),
		})
		.then(async (userFromDb) => {
			//check if this user even exists
			if (!userFromDb) return res.send("error")
			if (userFromDb.cart) {
				// so when there is valid user and he has a cart
				// create new one
				const newCart = new Cart(userFromDb.cart)
				const newProduct = foundProduct
				// add new info to cart
				newCart.add(newProduct, quantity)
				// push cart back to the DB
				await collections.users
					?.updateOne(
						{ _id: new ObjectId(userFromDb._id) },
						{ $set: { cart: newCart } }
					)
					.catch((err) => console.log(err))
			} else {
				// if there is no cart in user db
				// init cart with a product passed in body of a request
				const newProduct = foundProduct
				const newCart = new Cart({
					items: [{ product: newProduct, quantity: quantity }],
					totalQty: quantity,
					totalPrice: quantity * newProduct.price,
				})
				// then push brand new cart into DB
				await collections.users
					?.updateOne(
						{ _id: new ObjectId(userFromDb._id) },
						{ $set: { cart: newCart } }
					)
					.catch((err) => console.log(err))
			}
		})
	// fetch edited user, and send it as response
	let result = await collections.users?.findOne({
		_id: new ObjectId(req.user._id),
	})
	res.send(result)
	// this last section is optional, made for testing purposes, if I'd like to produce this app, definitely i'd remove this
}
export const changeQuantity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if there isn't any user logged in, skip this controller and go to next (session based cart)
	if (!req.user) return next()

	const { productId, quantity } = req.body
	// if user has no cart, this function is pointless
	await collections.users
		?.findOne({ _id: new ObjectId(req.user._id) })
		.then(async (userFromDb) => {
			if (!userFromDb) return res.send("Error")
			if (userFromDb.cart) {
				// create new cart
				const newCart = new Cart(userFromDb.cart)
				// perform fn
				newCart.changeQuantity(productId, quantity)
				// insert new Cart into DB
				await collections.users
					?.updateOne(
						{ _id: new ObjectId(userFromDb._id) },
						{ $set: { cart: newCart } }
					)
					.catch((err) => console.log(err))
			}
		})
	// fetch edited user, and send it as response
	let result = await collections.users?.findOne({
		_id: new ObjectId(req.user._id),
	})
	res.send(result)
	// this last section is optional, made for testing purposes, if I'd like to produce this app, definitely i'd remove this
}
export const deleteFromCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if there isn't any user logged in, skip this controller and go to next (session based cart)
	if (!req.user) return next()

	await collections.users
		?.findOne({ _id: new ObjectId(req.user._id) })
		.then(async (userFromDb) => {
			if (!userFromDb) return res.send("error")
			if (userFromDb.cart) {
				// create new cart, edit it and then pass to the session
				const newCart = new Cart(userFromDb.cart)
				newCart.deleteFromCart(req.body.productId)
				// insert new Cart into DB
				await collections.users
					?.updateOne(
						{ _id: new ObjectId(userFromDb._id) },
						{ $set: { cart: newCart } }
					)
					.catch((err) => console.log(err))
			}
		})
	// fetch edited user, and send it as response
	let result = await collections.users?.findOne({
		_id: new ObjectId(req.user._id),
	})
	res.send(result)
	// this last section is optional, made for testing purposes, if I'd like to produce this app, definitely i'd remove this
}
export const updateCartPrices = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if there isn't any user logged in, skip this controller and go to next (session based cart)
	if (!req.user) return next()

	await collections.users
		?.findOne({ _id: new ObjectId(req.user._id) })
		.then(async (userFromDb) => {
			if (!userFromDb) return res.send("error")
			if (userFromDb.cart) {
				// create new cart, edit it and then pass to the session
				const newCart = new Cart(userFromDb.cart)
				await newCart.syncWithDb()
				// insert new Cart into DB
				await collections.users
					?.updateOne(
						{ _id: new ObjectId(userFromDb._id) },
						{ $set: { cart: newCart } }
					)
					.catch((err) => console.log(err))
			}
		})
	// fetch edited user, and send it as response
	let result = await collections.users?.findOne({
		_id: new ObjectId(req.user._id),
	})
	res.send(result)
	// this last section is optional, made for testing purposes, if I'd like to produce this app, definitely i'd remove this
}
