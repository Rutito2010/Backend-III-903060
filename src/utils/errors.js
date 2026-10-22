// error con status HTTP para el middleware

export const ErrorDictionary = {
  "USER_NOT_FOUND": {
    statusCode: 404,
    message: "User not found",
    code: "USER_NOT_FOUND"
  },
  "INTERNAL_SERVER_ERROR":{
    statusCode: 500,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR"
  },
  "ADMIN_CREATION_FORBIDDEN":{
    statusCode: 403,
    message: "No se puede crear un admin desde este endpoint",
    code: "ADMIN_CREATION_FORBIDDEN"
  },
  "EMAIL_ALREADY_EXIST":{
    statusCode: 409,
    message: 'Ya existe un usuario con ese email',
    code: "EMAIL_ALREADY_EXIST"
  },
  "ROUTE_NOT_FOUND":{
    statusCode: 404,
    message: 'Ruta no encontrada',
    code: "ROUTE_NOT_FOUND"
  },
  "INVALID_ID":{
    statusCode: 400,
    message: 'EL id proporcionado no es valido',
    code: "INVALID_ID"
  },
  "INVALID_JSON":{
    statusCode: 400,
    message: 'JSON no valido',
    code: "INVALID_JSON"
  },
  "VALIDATION_ERROR":{
    statusCode: 400,
    message: 'Faltan datos obligatorios',
    code: "VALIDATION_ERROR"
  }
}


class AppError extends Error {
  constructor({message, statusCode, code}) { 
    super(message);
    this.statusCode = statusCode;
    this.code = code
  }
}
/*
class AppError extends Error {
  constructor(code) { 
    super(ErrorDictionary[code].message);
    this.statusCode = ErrorDictionary[code].statusCode;
    this.code = ErrorDictionary[code].code
  }
}*/

export default AppError;

/*
const createError(message, statusCode){
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}*/