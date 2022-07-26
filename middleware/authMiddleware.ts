import { Response, Request, NextFunction } from "express"

function authenticationMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.isAuthenticated()) {
		return next()
	} else return res.redirect("/api/login")
}
export default authenticationMiddleware
