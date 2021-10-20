const Post = require("./postServices");
const User = require("./userServices");
const models = require("../models/index.js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "test_jwt";
const Empty_user = {
  user_id: -1,
  name: "",
};
const store = {
  user: Empty_user,
  token: "",
};

// 로그인 할 아이디 비밃번호
const body = {
  user_id: "testUser5",
  password: "1234",
};

describe("user service", () => {
  // 테스트 전 로그인
  beforeAll(() => {
    const loginUser = User.login(body);
    if (loginUser) {
      const token = jwt.sign(String(loginUser.id), JWT_SECRET);
      store.user = loginUser;
      store.token = token;
    }
  });
  const include = null;

  it("전체 게시물을 조회해 온다.", async () => {
    // when
    const posts = await Post.findAll({
      limit: null,
      offset: null,
      include: null,
    });

    // then
    expect(posts.length).toBeGreaterThan(2);
  });
  it("전체 게시물의 유저도 함께 조회해 온다.", async () => {
    // given
    const include = [{ model: models.users, attributes: ["user_id", "name"] }];

    // when
    const posts = await Post.findAll({ limit: null, offset: null, include });

    // then
    expect(posts.length).toBeGreaterThan(2);
  });

  it("게시물 10개를 조회해 온다.", async () => {
    // when
    const posts = await Post.findAll({ limit: 10, offset: 0 });

    // then
    expect(posts.length).toEqual(10);
  });
  it("게시물 20개를 조회해 온다.", async () => {
    // when
    const posts = await Post.findAll({ limit: 20, offset: 0 });

    // then
    expect(posts.length).toEqual(20);
  });
  it("단일 게시물을 조회해 온다.", async () => {
    // when
    const post = await Post.findOne({ id: 22, include: null });

    // then
    expect(post.id).toEqual(22);
    expect(post.post).toBe("테스트게시글입니다. 2");
    expect(post.userId).toEqual(6);
    expect(post.user).toBeFalsy();
  });

  it("단일 게시물을 조회해 온다. 작성자도 포함한다.", async () => {
    // given
    // header 에 include 속성에 users 가 있다면,
    const include = [{ model: models.users, attributes: ["user_id", "name"] }];

    // when
    const post = await Post.findOne({ id: 22, include });

    // then
    expect(post.id).toEqual(22);
    expect(post.post).toBe("테스트게시글입니다. 2");
    expect(post.userId).toEqual(6);
    expect(post.user).toBeTruthy();
  });

  it("게시물을 작성할 수 있다.", async () => {
    //  given
    const body = {
      post: "게시글 입력",
      userId: 6,
    };

    // when
    const createdPost = await Post.createPost(body);
    console.log("createdPost", createdPost);

    // then
    expect(createdPost.post).toEqual("게시글 입력");
    expect(createdPost.userId).toBe(6);
  });
});
