import usersService from "../services/usersService.js";

class UsersController {
  async findAll(req, res) {
    try {
      const users = await usersService.findAll();
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
      const user = await usersService.findById(req.params.id);
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
      const user = usersService.create(req.body);
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
      const updatedUser = await usersService.update(req.params.id, req.body);
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
      const deletedUser = await usersService.delete(req.params.id);
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

export default new UsersController();

