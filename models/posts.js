"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  posts.init(
    {
      post: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  posts.associate = function (models) {
    posts.belongsTo(models.users, {
      foreignKey: "userId",
    });
  };
  return posts;
};
