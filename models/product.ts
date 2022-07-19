// External dependencies
import { ObjectId } from "mongodb";
// Class Implementation

enum yerbaOrigin {
    Uruguay,
    Argentinian,
    Paraguayan,
    Brazilian
}

export default class product {
    constructor(
        public name: string,
        public price: number,
        public origin: yerbaOrigin,
        public quantity: number) {}
}
