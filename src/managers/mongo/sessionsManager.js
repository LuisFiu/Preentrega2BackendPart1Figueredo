import userModel from "./models/user.model.js";

export default class sessionsManager {
  async getUserByEmail(email) {
    const user = await userModel.findOne({ email: email });
    return user;
  }

  async getUserById(id) {
    const user = await userModel.findOne({ _id: id });
    return user;
  }

  async createUser(userData) {
    const newUser = await userModel.create(userData);
    return newUser;
  }
}
