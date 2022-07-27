import { Response, Request, NextFunction } from "express"
import { validationResult } from "express-validator"

// this middleware checks if request is valid, and return BAD_REQUEST response if not.

const validatorHandler = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json(errors)
	next()
}

export default validatorHandler
