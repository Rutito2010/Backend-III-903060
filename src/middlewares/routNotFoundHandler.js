import AppError, { ErrorDictionary } from "../utils/errors.js"

const routeNotFound = (req, res, next)=>{
    next(new AppError(ErrorDictionary.ROUTE_NOT_FOUND))
}

export default routeNotFound