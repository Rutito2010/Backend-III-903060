import { USER_ROLES } from "../constants/constants.js";
import userRespository from "../repositories/user.respository.js";
import AppError from "../utils/errors.js";


class UsersService{

    async findAll(){
        return userRespository.findAll()
    }

    async findById(id){
        const user = await userRespository.findById(id)
        if(!user){
            throw new AppError("Usuario no encontrado", 404)
        }
        return user
    }

    async create(user){
        if(user.role === USER_ROLES.ADMIN){
            throw new AppError("No es posible crear admins desde este endpoint", 400)
        }

        const existingUser = await userRespository.findByEmail(user.email)
        if(existingUser){
            throw new AppError("Este email ya se encuentra registrado", 409)
        }

        return userRespository.create(user)
    }

    async update(id, user){
        const updatedUser = userRespository.update(id, user)
        if(!updatedUser){
            throw new AppError("Usuario no encontrado", 404)
        }

        return updatedUser
    }

    async delete(id){
        const deletedUser = userRespository.delete(id)

        if(!deletedUser){
            throw new AppError("Usuario no encontrado", 404)
        }

        return deletedUser
    }
}

export default new UsersService()