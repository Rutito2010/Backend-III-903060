import AppError, { ErrorDictionary } from '../utils/errors.js';
import { USER_ROLES, DOCUMENT_TYPES } from '../constants/index.js';

const USER_UPLOAD_TYPES = [
  DOCUMENT_TYPES.USER_DOCUMENT,
  DOCUMENT_TYPES.DRIVER_LICENSE
]

class UsersService {
  constructor (userRepostiory){
    this.userRepository = userRepostiory
  }

  async addDocument(id, file, type){
    if(!file) throw new AppError(ErrorDictionary.FILE_REQUIRED);
    if(!USER_UPLOAD_TYPES.includes(type)){
      throw new AppError(ErrorDictionary.INVALID_DOCUMENT_TYPE)
    }
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(ErrorDictionary.USER_NOT_FOUND);
    }

    /**que pasa si un usuario trata de cargar su licencia de conducir, pero no tiene rol de driver */
    //para multiples archivos manejamos files que provienen como un array
    user.documents.push({
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      type
    })

    return this.userRepository.update(id, {documents: user.documents})
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
