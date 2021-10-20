const models = require("../models/index.js");

const findAll = async ({ offset = 0, limit = 100 }) => {
  try {
    const users = await models.users.findAll({ offset, limit });
    return users;
  } catch (error) {
    return new Error(error);
  }
};

const findOne = async ({ id, include = null }) => {
  try {
    const user = await models.users.findOne({
      where: { id },
      include,
      attributes: ["id", "user_id", "name"],
    });
    return user;
  } catch (error) {
    return error;
  }
};

const createUser = async ({ body }) => {
  try {
    const createdUser = await models.users.create(body);
    return createdUser;
  } catch (error) {
    return error;
  }
};

const putUser = async ({ name, id }) => {
  try {
    const user = await models.users.findOne({ where: { id } });
    user.name = name;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    return error;
  }
};

const deleteUser = async (id) => {
  try {
    await models.users.destroy({ where: { id } });
    return true;
  } catch (error) {
    return error;
  }
};

const login = async ({ user_id, password }) => {
  try {
    const user = await models.users.findOne({
      where: { user_id, password },
      attributes: ["id", "user_id", "name"],
    });
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  findAll,
  findOne,
  createUser,
  putUser,
  deleteUser,
  login,
};
