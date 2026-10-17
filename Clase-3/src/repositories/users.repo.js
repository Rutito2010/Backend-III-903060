import User from '../models/user.model.js';
class UsersRepository {
  async findAll() {
    return User.find();
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findByRole(role) {
    return User.find({ role });
  }

  async create(userData) {
    return User.create(userData);
  }

  async insertMany(usersData) {
    return User.insertMany(usersData);
  }

  async update(id, userData) {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

export default new UsersRepository();
