// External Dependencies

import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables

export const collections: { users?: mongoDB.Collection, products?: mongoDB.Collection } = {}

// Initialize Connection

export async function connectToDatabase () {
	dotenv.config();
 
	const mongoURI = process.env.MONGO_URI as string

	const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongoURI);
			
	await client.connect();
		
	const db: mongoDB.Db = client.db("ecommerce");
   
	const usersCollection: mongoDB.Collection = db.collection("users");
	const productsCollection: mongoDB.Collection = db.collection("products");
 
  collections.users = usersCollection;
  collections.products = productsCollection;
	   
		 console.log(`Successfully connected to database: ${db.databaseName}`);
 }