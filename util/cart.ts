import { ObjectId } from "mongodb"
import cartProduct from "../models/cartProduct"
import product from "../models/product"

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
				console.log(this.items[i])
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
	public changeQuantity = (productId: ObjectId, newQuantity: number): void => {
		this.items.forEach((n, i) => {
			if (productId === n.product._id) {
				this.items[i].quantity = newQuantity
			}
			this.recalculateTotals()
		})
	}
	// this function is updating total values of the whole cart, im gonna invoke it at the end of each function here
	public recalculateTotals = () => {
		let newPrice = 0
		let newQty = 0
		this.items.forEach((n, i) => {
			newQty += n.quantity
			newPrice += n.product.price * n.quantity
		})
		this.totalQty = newQty
		this.totalPrice = newPrice
	}
}
