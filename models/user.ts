// External dependencies
import { ObjectId } from "mongodb"
import product from "./product"
// Class Implementation

export default class user {
	constructor(
		public email: string,
		public password: string,
		public cart: product[],
		public _id?: ObjectId
	) {}
}
