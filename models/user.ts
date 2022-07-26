// External dependencies
import { ObjectId } from "mongodb"
// Class Implementation

export default class user {
	constructor(
		public email: string,
		public password: string,
		public _id?: ObjectId
	) {}
}
