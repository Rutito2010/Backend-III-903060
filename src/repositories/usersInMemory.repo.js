import crypto from 'crypto';

class UsersMemoryRepository {
  constructor() {
    this.users = [];
  }

  async findAll() {
    return this.users.map((user) => ({ ...user }));
  }

  async findById(id) {
    const user = this.users.find((item) => item._id === id);
    return user ? { ...user } : null;
  }

  async findByEmail(email) {
    const user = this.users.find(
      (item) => item.email === String(email).toLowerCase()
    );
    return user ? { ...user } : null;
  }

  async findByRole(role) {
    return this.users
      .filter((item) => item.role === role)
      .map((user) => ({ ...user }));
  }

  async create(userData) {
    const user = {
      ...userData,
      _id: crypto.randomBytes(12).toString('hex'),
      email: String(userData.email).toLowerCase(),
      role: userData.role || 'customer',
      isAvailable: userData.isAvailable ?? true,
      documents: userData.documents || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return { ...user };
  }

  async insertMany(usersData) {
    const created = [];
    for (const userData of usersData) {
      created.push(await this.create(userData));
    }
    return created;
  }

  async update(id, userData) {
    const index = this.users.findIndex((item) => item._id === id);
    if (index === -1) return null;

    const { _id, ...changes } = userData;
    if (changes.email) changes.email = String(changes.email).toLowerCase();

    this.users[index] = {
      ...this.users[index],
      ...changes,
      _id: this.users[index]._id,
      updatedAt: new Date()
    };
    return { ...this.users[index] };
  }

  async delete(id) {
    const index = this.users.findIndex((item) => item._id === id);
    if (index === -1) return null;
    const [deleted] = this.users.splice(index, 1);
    return { ...deleted };
  }
}

export default new UsersMemoryRepository();