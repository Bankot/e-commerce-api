import { ObjectId } from "mongodb"

export default class product {
	constructor(
		public name: string,
		public price: number,
		public description: string,
		public _id?: ObjectId
	) {}
}
