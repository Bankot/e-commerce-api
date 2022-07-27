import { ObjectId } from "mongodb"
import cartProduct from "../models/cartProduct"
import product from "../models/product"
import { collections } from "../db/db"

export default class Cart {
	constructor(oldCart: any) {
		this.items = oldCart.items
		this.totalQty = oldCart.totalQty
		this.totalPrice = oldCart.totalPrice
	}
	public items: cartProduct[]
	public totalQty: number
	public totalPrice: number

	// define add to cart function

	public add = (product: product, quantity: number): void => {
		let finished = false

		// check if there's a record for this item
		this.items.forEach((n, i) => {
			if (product.name === n.product.name) {
				this.items[i].quantity += quantity
				finished = true
			}
		})

		// if there's not this item yet, add it
		if (!finished) {
			this.items.push({ product: product, quantity: quantity })
		}
		this.recalculateTotals()
	}
	public changeQuantity = (productId: string, newQuantity: number): void => {
		this.items.forEach((n, i) => {
			if (productId === n.product._id?.toString()) {
				this.items[i].quantity = newQuantity
			}
			this.recalculateTotals()
		})
	}
	public deleteFromCart = (productId: ObjectId): void => {
		let newItemsArray = this.items.filter((n) => {
			// deleting item with given id, if it doesn't exist just dont do nothing
			return n.product._id != productId
		})
		this.items = newItemsArray
		this.recalculateTotals()
	}
	// this function is updating total values of the whole cart, im gonna invoke it at the end of each function here
	public recalculateTotals = () => {
		let newPrice = 0
		let newQty = 0
		let productFromDb: any = null
		this.items.forEach(async (n, i) => {
			newQty += n.quantity
			newPrice += n.product.price * n.quantity
		})
		this.totalQty = newQty
		this.totalPrice = newPrice
	}
	public syncWithDb = async () => {
		// this fn is syncing cart products with actual DB products
		// so if description, name or price changes, we can easily update full cart

		// i guess it could be done more aetheticly, so i will work on it later!

		let index = 0
		for await (const n of this.items) {
			console.log(this.items[index].product._id)
			// fetching product
			await collections.product
				?.findOne({
					_id: new ObjectId(n.product._id),
				})
				.then((productFromDb) => {
					if (productFromDb) {
						// updating all fields
						const { name, price, description, _id } = productFromDb
						this.items[index].product = {
							_id: _id,
							name: name,
							price: price,
							description: description,
						}
						index++
					}
				})
				.catch((err) => console.log(err))
		}
		// at the end calculating total values of the cart
		this.recalculateTotals()
		return
	}
}
