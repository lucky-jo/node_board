"use strict";
let datas = [];
const addDummy = (id) => {
  for (let i = 1; i < 5; i++) {
    let obj = {
      post: "테스트게시글입니다. " + i,
      createdAt: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      updatedAt: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      userId: id,
    };
    datas.push(obj);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    for (let index = 1; index < 10; index++) {
      addDummy(index);
    }

    return queryInterface.bulkInsert("posts", datas, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("posts", null, {});
  },
};
