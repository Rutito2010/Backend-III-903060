import AppError, { ErrorDictionary } from '../utils/errors.js';
import { USER_ROLES } from '../constants/index.js';

class UsersService {
  constructor (userRepostiory){
    this.userRepository = userRepostiory
  }
  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(ErrorDictionary.USER_NOT_FOUND);
    }
    return user;
  }

  async create(userData) {
    if (userData.role === USER_ROLES.ADMIN) {
      throw new AppError(ErrorDictionary.ADMIN_CREATION_FORBIDDEN);
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError(ErrorDictionary.EMAIL_ALREADY_EXIST);
    }

    const newUser = await this.userRepository.create(userData);
    return newUser;
  }

  async update(id, userData) {
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new AppError(ErrorDictionary.USER_NOT_FOUND);
    }
    return updatedUser;
  }

  async delete(id) {
    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser) {
      throw new AppError(ErrorDictionary.USER_NOT_FOUND);
    }
    return deletedUser;
  }
}

export default UsersService;
