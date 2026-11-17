import AppError, {ErrorDictionary} from "../utils/errors.js";
import multer from "multer";
const errorHandler = (err, req, res, next)=>{
console.log(err)


/**
 * como manejar errores de multer 
 */
    if (err instanceof multer.MulterError){

        if(err.code == "LIMIT_FILE_SIZE"){
            err = new AppError(ErrorDictionary.INVALID_FILE_SIZE)
        }
        else{
            err = new AppError(ErrorDictionary.UPLOAD_ERROR)
        }
    }

    if(err.name === "CastError"){
        err = new AppError(ErrorDictionary.INVALID_ID)
    }

    if(err.type === "entity.parse.failed"){
        err = new AppError(ErrorDictionary.INVALID_JSON)
    }

    if(err.name === "ValidationError"){
        err = new AppError(ErrorDictionary.VALIDATION_ERROR)
    }

    const isAppError = err instanceof AppError

    const statusCode = isAppError ? err.statusCode : ErrorDictionary.INTERNAL_SERVER_ERROR.statusCode
    const message = isAppError ? err.message :  ErrorDictionary.INTERNAL_SERVER_ERROR.message
    const code = isAppError ? err.code :  ErrorDictionary.INTERNAL_SERVER_ERROR.code;
    res.status(statusCode).json({
        status: 'error',
        message,
        code
    });
}

export default errorHandler