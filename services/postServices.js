const models = require("../models/index.js");

const findAll = async ({ offset, limit, include = null }) => {
  try {
    const posts = await models.posts.findAll({ offset, limit, include });
    return posts;
  } catch (error) {
    return error;
  }
};

const findOne = async ({ id, include = null }) => {
  try {
    const post = await models.posts.findOne({
      where: { id },
      include,
    });
    return post;
  } catch (error) {
    return error;
  }
};

const createPost = async ({ post, userId }) => {
  try {
    const createdPost = await models.posts.create({ post, userId });
    return createdPost;
  } catch (error) {
    return error;
  }
};

const putPost = async ({ Post, post }) => {
  try {
    Post.post = post;
    const updatedPost = await Post.save();
    return updatedPost;
  } catch (error) {
    return error;
  }
};

const deletePost = async (id) => {
  try {
    await models.posts.destroy({ where: { id } });
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = {
  findAll,
  findOne,
  createPost,
  putPost,
  deletePost,
};
