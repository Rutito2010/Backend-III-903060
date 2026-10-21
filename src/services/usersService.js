import { USER_ROLES } from "../constants/constants.js";
import AppError from "../utils/errors.js";

class UsersService {

  constructor(repository) {
    this.respository = repository;
  }

  async findAll() {
    return this.respository.findAll();
  }

  async findById(id) {
    const user = await this.respository.findById(id);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return user;
  }

  async create(user) {
    if (user.role === USER_ROLES.ADMIN) {
      throw new AppError("No es posible crear admins desde este endpoint", 400);
    }

    const existingUser = await this.respository.findByEmail(user.email);
    if (existingUser) {
      throw new AppError("Este email ya se encuentra registrado", 409);
    }

    return this.respository.create(user);
  }

  async update(id, user) {
    const updatedUser = this.respository.update(id, user);
    if (!updatedUser) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return updatedUser;
  }

  async delete(id) {
    const deletedUser = this.respository.delete(id);

    if (!deletedUser) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return deletedUser;
  }
}

export default UsersService;
