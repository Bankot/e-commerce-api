import { NextFunction, Request, Response } from "express"
import Cart from "../util/cart"
import product from "../models/product"
import { ObjectId } from "mongodb"
import { collections } from "../db/db"

export const addToCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// get required info from request

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

	// check if theres already a cart for this session

	if (req.session.cart) {
		const newCart = new Cart(req.session.cart)
		const newProduct = foundProduct
		newCart.add(newProduct, quantity)
		req.session.cart = newCart
	} else {
		// if there is no cart in session
		// init cart with a product passed in body of a request
		const newProduct = foundProduct
		const newCart = new Cart({
			items: [{ product: newProduct, quantity: quantity }],
			totalQty: quantity,
			totalPrice: quantity * newProduct.price,
		})
		req.session.cart = newCart
	}
	res.send(req.session.cart)
}
export const changeQuantity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { productId, quantity } = req.body
	if (req.session.cart) {
		const newCart = new Cart(req.session.cart)
		try {
			newCart.changeQuantity(productId, quantity)
		} catch (err) {
			res.status(400).send("Please try again later!")
		}
		req.session.cart = newCart
		res.send(req.session.cart)
	}
}
