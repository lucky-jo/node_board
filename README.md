node_board

# 관계 매핑

게시글은 많은 댓글을 가지고 있으며, 댓글은 한 게시글에 속해 있기 때문에, 게시글과 댓글은 1 : M 관계입니다.

```
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
```

따라서 models 폴더 안에 존재하는 각각의 모델 파일에서 모델간의 관계를 정의하면, /models/index.js 파일에서 모델 간의 관계를 통합하게 됩니다.

특이사항으로는, header 속성값으로 option 을 줄 경우, 매핑되어 있는 테이블의 값도 같이 가져오도록 하였습니다. ( EAGER )
header 에 옵션값이 없을 경우, 해당 요청의 테이블값만 가저옵니다 ( LAZY )

ex) GET /posts & header option 값으로 users 를 포함할 경우, 모든 게시물 & 게시작성자 정보를 모두 포함
ex) GET /users/:id header option 값으로 posts 를 포함할 경우, :id 유저의 모든 게시물 포함하여 결과값을 반환

Restful API 형식을 지키려고 노력하였습니다.

ex) GET /posts 전체 조회
ex) GET /posts/:id id 값에 해당하는 단일 조회
ex) POST /posts 게시글 등록
ex) PUT /posts/:id 수정 및 업데이트
ex) DELETE /posts/:id

서버에서 store를 만들어 로그인한 유저의 정보를 저장 후, 게시물의 업데이트 혹은 삭제시 동일한 userId 를 갖는지 확인하도록 하였습니다.
끝으로 Create, All get, Get의 테스트 코드를 작성하였습니다.

# sequelize Cli 명령어 모음

```
sequelize model:create --name users --attributes "user_id:string, name:string, password:string"
sequelize model:create --name posts --attributes "post:string"
sequelize model:create --name reply --attributes "postId:integer, author:string, content:text"

sequelize db:migrate
sequelize seed:generate --name test

sequelize db:seed:all
sequelize db:seed:undo:all
```

# API 문서

## 게시판

GET /posts 게시글 전체를 조회 한다. header option 값으로 users 를 포함할 경우

```
{
  "count": 10,
  "data": [
    {
      "id": 1,
      "post": "테스트게시글입니다. 1",
      "createdAt": "2021-10-20T09:30:38.000Z",
      "updatedAt": "2021-10-20T09:30:38.000Z",
      "userId": 1,
      "user": {
        "user_id": "testUser0",
        "name": "홍길동0"
      }
    },
  ]
}
```

GET /posts 게시글 전체를 조회 한다. 옵션 미적용

```
{
  "count": 10,
  "data": [
    {
      "id": 1,
      "post": "테스트게시글입니다. 1",
      "createdAt": "2021-10-20T09:30:38.000Z",
      "updatedAt": "2021-10-20T09:30:38.000Z",
      "userId": 1
    },
  ]
}
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

DELET /posts/:id

```
deleted
```

## 회원 API

GET /users 게시글 전체를 조회 한다.

```
{
  "count": 73,
  "data": {
    "users": [
      {
        "id": 1,
        "user_id": "testUser0",
        "name": "홍길동0",
        "password": "1234",
        "createdAt": "2021-10-20T09:30:38.000Z",
        "updatedAt": "2021-10-20T09:30:38.000Z"
      },
    ]
  }
}
```

GET /users/:id 단일 회원을 조회한다. header option 값으로 posts 를 포함한 경우

```
{
  "data": {
    "id": 6,
    "user_id": "testUser5",
    "name": "홍길동5",
    "posts": [
      {
        "id": 21,
        "post": "1",
        "createdAt": "2021-10-20T09:30:38.000Z",
        "updatedAt": "2021-10-20T09:39:34.482Z"
      },
    ]
  }
}
```

GET /users/:id 단일 회원을 조회한다. header option 미포함

```
{
  "data": {
    "id": 6,
    "user_id": "testUser5",
    "name": "홍길동5"
  }
}
```

PUT /users/:id
request

```
{
    "name":"user2"
}
```

response

```
{
  "data": {
    "id": 2,
    "user_id": "testUser1",
    "name": "user2",
    "password": "1234",
    "createdAt": "2021-10-20T09:30:38.000Z",
    "updatedAt": "2021-10-20T09:32:08.529Z"
  }
}
```

DELET /users/:id
{
deleted
}
