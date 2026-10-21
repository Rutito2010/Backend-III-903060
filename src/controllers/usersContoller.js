import { servicio } from "../depencies.js";

class UsersController {
 
  constructor(usersService){
    this.usersService = usersService
  }

  async findAll(req, res) {
    try {
      const users = await this.usersService.findAll();
      return res.status(200).json({
        status: "success",
        payload: users,
      });
    } catch (e) {
      return res.status(e.statusCode || 500).json({
        status: "error",
        message: e.message,
      });
    }
  }

  async findById(req, res) {
    try {
      const user = await this.usersService.findById(req.params.id);
      return res.status(200).json({
        status: "success",
        payload: user,
      });
    } catch (e) {
      return res.status(e.statusCode || 500).json({
        status: "error",
        message: e.message,
      });
    }
  }

  async create(req, res) {
    try {
      const user = this.usersService.create(req.body);
      return res.status(201).json({
        status: "success",
        payload: user,
      });
    } catch (e) {
      return res.status(e.statusCode || 500).json({
        status: "error",
        message: e.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedUser = await this.usersService.update(req.params.id, req.body);
      return res.status(201).json({
        status: "success",
        payload: updatedUser,
      });
    } catch (e) {
      return res.status(e.statusCode || 500).json({
        status: "error",
        message: e.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedUser = await this.usersService.delete(req.params.id);
      return res.status(201).json({
        status: "success",
        payload: deletedUser,
      });
    } catch (e) {
      return res.status(e.statusCode || 500).json({
        status: "error",
        message: e.message,
      });
    }
  }
}

export default new UsersController(servicio);
