import { Request, Response, NextFunction } from "express";
import product from "../models/product";
import { collections } from "../db/db";

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    const newProduct : product = {
        name: req.body.name,
        price: req.body.price,
        origin: req.body.origin,
        quantity: req.body.quantity
    }
    if(newProduct){
        try{
            await collections.products?.insertOne(newProduct)
            return res.send("Succesfully added a product!")
        }catch(err){
            return res.status(400).send("Something went wrong!")
        }
        
    }else return res.status(400).send("Please provide a valid product.")
}
// export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {

// }
// export const modifyProduct = async (req: Request, res: Response, next: NextFunction) => {

// }