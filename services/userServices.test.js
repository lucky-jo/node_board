const User = require("./userServices");
const models = require("../models/index.js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "test_jwt";
const Empty_user = {
  user_id: 0,
  name: "",
};
const store = {
  user: Empty_user,
  token: "",
};

describe("user service", () => {
  const include = null;
  it("전체 회원을 조회해 온다.", async () => {
    // when
    const users = await User.findAll({ limit: null, offset: null });

    // then
    expect(users.length).toBeGreaterThan(2);
  });
  it("회원 10명을 조회해 온다.", async () => {
    // when
    const users = await User.findAll({ limit: 10, offset: 0 });

    // then
    expect(users.length).toEqual(10);
  });
  it("회원 20명을 조회해 온다.", async () => {
    // when
    const users = await User.findAll({ limit: 20, offset: 0 });

    // then
    expect(users.length).toEqual(20);
  });
  it("단일 회원을 조회해 온다.", async () => {
    // when
    const user = await User.findOne({ id: 6, include: null });

    // then
    expect(user.id).toEqual(6);
    expect(user.user_id).toBe("testUser5");
    expect(user.name).toBe("홍길동5");
  });

  it("단일 회원을 조회해 온다.", async () => {
    // when
    const user = await User.findOne({ id: 6, include: null });

    // then
    expect(user.id).toEqual(6);
    expect(user.user_id).toBe("testUser5");
    expect(user.name).toBe("홍길동5");
    expect(user.posts).toBeFalsy();
  });
  it("단일 회원 조회시, 헤더에 users 를 포함하면, 회원의 모든 글이 같이 조회 된다.(posts가 존재한다.)", async () => {
    // given
    // header 에 include 속성에 posts 가 있다면,
    const include = [
      {
        model: models.posts,
        attributes: ["id", "post", "createdAt", "updatedAt"],
      },
    ];

    // when
    const user = await User.findOne({ id: 6, include: include });

    // then
    expect(user.id).toEqual(6);
    expect(user.user_id).toBe("testUser5");
    expect(user.name).toBe("홍길동5");
    expect(user.posts).toBeTruthy();
  });

  it("회원 가입을 할 수 있다.", async () => {
    //  given
    const body = {
      user_id: "user1",
      password: "password1",
      name: "신규회원",
    };
    // when
    const createUser = await User.createUser({ body });

    // then
    expect(createUser.user_id).toBe(body.user_id);
    expect(createUser.password).toBe(body.password);
    expect(createUser.name).toBe(body.name);
  });
});
