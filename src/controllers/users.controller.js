import UsersService from '../services/users.service.js';
import { userRepostiory } from '../repositories/index.js';

const usersService = new UsersService(userRepostiory)

class UsersController {
  async findAll(req, res, next) {

    try {
      const users = await usersService.findAll();
      res.json({ status: 'success', payload: users });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const user = await usersService.findById(req.params.id);
      res.json({ status: 'success', payload: user });
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const newUser = await usersService.create(req.body);
      res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updatedUser = await usersService.update(req.params.id, req.body);
      res.json({ status: 'success', payload: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await usersService.delete(req.params.id);
      res.json({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsersController();
