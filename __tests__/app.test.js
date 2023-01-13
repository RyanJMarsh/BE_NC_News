const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("api", () => {
  test("404: non existant route", () => {
    return request(app)
      .get("/aps")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found");
      });
  });
});

describe("GET: /api/topics", () => {
  test("200: should return topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET: /api/articles", () => {
  test("200: should return articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("200: should return article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.anything(),
          comment_count: expect.any(String),
        });
      });
  });
  test("400: returns error when article_id is not of correct type", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("404: returns error when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/100000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article_id does not exist");
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("200: should return comment for given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            votes: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: should return empty array when given an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(0);
      });
  });
  test("400: returns error when article_id is not of correct type", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("404: returns error when article_id is of correct type but does not exist", () => {
    return request(app)
      .get("/api/articles/100000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article_id does not exist");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: return object containing comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Example Comment Example",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toStrictEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "Example Comment Example",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: returns error when comment is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: 7,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Comment");
      });
  });
  test("400: returns error when article_id is not correct type", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Example Comment Example",
    };
    return request(app)
      .post("/api/articles/dog/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("400: returns error when article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Example Comment Example",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: should return updated article when sent an object with inc_votes key", () => {
    const patchObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("400: returns error when patchObj is invalid", () => {
    const patchObj = { inc_votes: "DOG" };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("400: returns error when article_id is not correct type", () => {
    const patchObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/dog")
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("400: returns error when article_id does not exist", () => {
    const patchObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1000")
      .send(patchObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});

describe("GET: /api/users", () => {
  test("200: should return users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((topic) => {
          expect(topic).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});