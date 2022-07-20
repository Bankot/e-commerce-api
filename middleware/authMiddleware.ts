import {Response, Request, NextFunction} from "express"

function authenticationMiddleware () {
    return function (req: Request, res: Response, next: NextFunction) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/')
    }
  }
export default authenticationMiddleware