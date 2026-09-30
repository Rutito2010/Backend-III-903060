import { generateMockUser, generateMockUsers } from "../mocks/users.mock.js";

class MockController {
  getUsers = (req, res) => {

    try {
      const users = generateMockUsers(10);
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
  };

  getUser = (req, res) => {
    try {
      const user = generateMockUser();
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
  };
}

export default new MockController();
