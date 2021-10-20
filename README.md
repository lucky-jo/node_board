node_board

sequelize model:create --name users --attributes "user_id:string, name:string, password:string"
sequelize model:create --name posts --attributes "post:string"
sequelize model:create --name reply --attributes "postId:integer, author:string, content:text"

sequelize db:migrate

게시글은 많은 댓글을 가지고 있으며, 댓글은 한 게시글에 속해 있기 때문에, 게시글과 댓글은 1 : M 관계입니다.

```
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
```

따라서 models 폴더 안에 존재하는 각각의 모델 파일에서 모델간의 관계를 정의하면, /models/index.js 파일에서 모델 간의 관계를 통합하게 됩니다.

sequelize seed:generate --name test

sequelize db:seed:all
sequelize db:seed:undo:all

API 문서

GET /posts 게시글 전체를 조회 한다.
옵션 미적용

```
[
  {
    "id": 11,
    "post": "테스트게시글입니다. 11",
    "createdAt": "2021-10-19T19:40:03.000Z",
    "updatedAt": "2021-10-19T19:40:03.000Z",
    "userId": 1,
  },
]
```

GET /posts 게시글 전체를 조회 한다. // header option : users 를 같이 전달하면, 글쓴이의 정보도 같이 전달된다.
옵션 적용

```
[
  {
    "id": 11,
    "post": "테스트게시글입니다. 11",
    "createdAt": "2021-10-19T19:40:03.000Z",
    "updatedAt": "2021-10-19T19:40:03.000Z",
    "userId": 1,
    "user": {
      "user_id": "testUser0",
      "name": "홍길동"
    }
  },
]
```

GET /posts/:id // header option 미적용

```
{
  "id": 1,
  "post": "테스트게시글입니다. 1",
  "createdAt": "2021-10-19T19:40:03.000Z",
  "updatedAt": "2021-10-19T19:40:03.000Z",
  "userId": 1,
}
```

GET /posts/:id // header option : users 를 같이 전달하면, 글쓴이의 정보도 같이 전달된다.

```
{
  "id": 1,
  "post": "테스트게시글입니다. 1",
  "createdAt": "2021-10-19T19:40:03.000Z",
  "updatedAt": "2021-10-19T19:40:03.000Z",
  "userId": 1,
  "user": {
    "user_id": "testUser0",
    "name": "홍길동"
  }
}
```

POST /posts
request

```
{
  post: type.String,
  userId: type.Number,
}
```

response

```
{
  "id": 399,
  "post": "게시글 입력",
  "userId": 10,
  "updatedAt": "2021-10-19T20:37:10.200Z",
  "createdAt": "2021-10-19T20:37:10.200Z"
}
```

PUT /posts/:id
request

```
{
  post: type.String,
}
```

response

```
{
  "id": 1,
  "post": "1",
  "createdAt": "2021-10-19T19:40:03.000Z",
  "updatedAt": "2021-10-19T20:49:32.241Z",
  "userId": 1
}
```
