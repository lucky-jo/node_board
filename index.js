const express = require("express");
const models = require("./models/index.js");
const jwt = require("jsonwebtoken");
const User = require("./services/userServices");
const Post = require("./services/postServices");

// force  옵션시 디비 삭제
// models.sequelize.sync({ force: true }).then(() => console.log("db is ready"));
models.sequelize.sync({ force: false }).then(() => console.log("db is ready"));

const JWT_SECRET = "test_jwt";
const Empty_user = {
  user_id: -1,
  name: "",
};
const store = {
  user: Empty_user,
  token: "",
};

const app = express();

// body 파싱
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test Server");
});
// 로그인
app.post("/login", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    if (user_id && password) {
      const findUser = await User.login({ user_id, password });
      if (findUser) {
        const token = jwt.sign(String(findUser.id), JWT_SECRET);
        store.user = findUser;
        store.token = token;
        res.send({ findUser, token });
      } else {
        res.send("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } else {
      res.send("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  } catch (error) {
    res.send("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
});
// 회원 전체 조회
app.get("/users", async (req, res) => {
  const { limit, offset } = req.query;
  try {
    const users = await User.findAll({ limit, offset });
    const response = {
      count: users.length,
      data: {
        users,
      },
    };
    res.send(response);
  } catch (error) {
    res.send({ error });
  }
});
// 회원 단일 조회
app.get("/users/:id", async (req, res) => {
  const option = req.headers["option"];
  let include = null;

  if (option) {
    include =
      option === "posts"
        ? [
            {
              model: models.posts,
              attributes: ["id", "post", "createdAt", "updatedAt"],
            },
          ]
        : null;
  }
  try {
    const id = req.params.id;
    const user = await await User.findOne({ id, include });
    res.send({ data: user });
  } catch (error) {
    res.send({ error });
  }
});
// 회원 업데이트
app.put("/users/:id", async (req, res) => {
  // header로 token이 넘어왔다는 가정을, store.token 으로 접근했습니다.
  try {
    if (store.token) {
      const userId = jwt.verify(store.token, JWT_SECRET);
      const id = req.params.id;

      if (Number(id) === Number(userId)) {
        const updatedUser = await User.putUser({ id, name: req.body.name });
        res.send({ data: updatedUser });
      } else {
        res.send("로그인 유저와, 업데이트 하려는 유저의 정보가 다릅니다.");
      }
    } else {
      res.send("로그인을 해주세요.");
    }
  } catch (error) {
    res.send({ error });
  }
});
// 회원 삭제
app.delete("/users/:id", async (req, res) => {
  // header로 token이 넘어왔다는 가정을, store.token 으로 접근했습니다.
  if (store.token) {
    const userId = jwt.verify(store.token, JWT_SECRET);
    const id = req.params.id;
    if (Number(id) === Number(userId)) {
      await User.deleteUser({ id: id });
      res.send("deleted");
    } else {
      res.send("로그인 유저와, 삭제하려는 유저의 정보가 다릅니다.");
    }
  }
});
// 회원가입
app.post("/users", async (req, res) => {
  try {
    const createdUser = await User.createUser({ body: req.body });
    res.send({ data: createdUser });
  } catch (error) {
    res.send({ error });
  }
});
// 글쓰기
app.post("/posts", async (req, res, next) => {
  console.log("12123");
  const { post, userId } = req.body;
  if (post && userId) {
    try {
      const createdPost = await Post.createPost({
        post,
        userId,
      });
      res.send({ data: createdPost });
    } catch (error) {
      res.send({ error });
    }
  } else {
    res.send("Payload 가 올바르지 않습니다. API 문서를 확인해주세요.");
  }
});
// 전체 글 조회
app.get("/posts", async (req, res) => {
  const option = req.headers["option"];
  let include = null;

  if (option) {
    include =
      option === "users"
        ? [{ model: models.users, attributes: ["user_id", "name"] }]
        : null;
  }
  const { limit = 10, offset = 0 } = req.query;

  try {
    const posts = await Post.findAll({
      offset,
      limit,
      include,
    });
    const response = {
      count: posts.length,
      data: posts,
    };
    res.send(response);
  } catch (error) {
    res.send({ error });
  }
});
// 단일 글 조회
app.get("/posts/:id", async (req, res) => {
  const option = req.headers["option"];
  let include = null;

  if (option) {
    include =
      option === "users"
        ? [{ model: models.users, attributes: ["user_id", "name"] }]
        : null;
  }
  try {
    const id = req.params.id;
    const user = await Post.findOne({ id, include });
    res.send(user);
  } catch (error) {
    res.send({ error });
  }
});
// 글 업데이트
app.put("/posts/:id", async (req, res) => {
  if (store.token) {
    const userId = jwt.verify(store.token, JWT_SECRET);
    const { id } = req.params;
    try {
      const post = await Post.findOne({ id });
      const authorId = post.userId;
      if (Number(authorId) === Number(userId)) {
        const updatedPost = await Post.putPost({
          Post: post,
          post: req.body.post,
        });
        res.send({ data: updatedPost });
      } else {
        res.send("작성자와 로그인 유저가 서로 다릅니다.");
      }
    } catch (error) {
      res.send({ error });
    }
  } else {
    res.send("로그인을 먼저 해주세요.");
  }
});
// 글 삭제
app.delete("/posts/:id", async (req, res) => {
  if (store.token) {
    const userId = jwt.verify(store.token, JWT_SECRET);
    const id = req.params.id;
    try {
      const post = await Post.findOne({ id });
      const authorId = post.userId;
      if (Number(authorId) === Number(userId)) {
        await Post.deletePost({ id: id });
        res.send("deleted");
      } else {
        res.send("작성자와 로그인 유저가 서로 다릅니다.");
      }
    } catch (error) {
      res.send({ error });
    }
  } else {
    res.send("로그인을 먼저 해주세요.");
  }
});

app.listen(3000, () => {
  console.log("app is running");
});
