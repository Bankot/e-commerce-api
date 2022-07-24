import { Response, Request, NextFunction } from "express"

function authenticationMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.isAuthenticated()) {
		return next()
	} else return res.send("You are not authenticated to acces this route!")
}
export default authenticationMiddleware
