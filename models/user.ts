// External dependencies
import { ObjectId } from "mongodb"
import Cart from "../util/cart"
// Class Implementation

export default class user {
	constructor(
		public email: string,
		public password: string,
		public cart?: any,
		public _id?: ObjectId
	) {}
}
