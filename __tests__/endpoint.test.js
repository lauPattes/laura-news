const app = require("../server/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const fs = require("fs/promises");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("Get 200 sends an array of topic objects to the client, each of which should have an age and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const arr = response.body.topics;
        expect(arr).toHaveLength(3);
        arr.forEach((obj) => {
          expect(obj).toHaveProperty("slug");
          expect(obj).toHaveProperty("description");
        });
      });
  });
  test("Get 404 sends an appropriate error message when given an incorrect path", () => {
    return request(app)
      .get("/api/topicZ")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("path not found");
      });
  });
});

describe("/api", () => {
  test("Get 200 sends object to the client describing all the endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const gotFile = response.body.endpoints;
        return fs.readFile("endpoints.json", "utf8").then((readFile) => {
          expect(gotFile).toEqual(JSON.parse(readFile));
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("Get sends an article object to the client with all the correct properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(3);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test("GET: 404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET: 400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
  test("GET: 404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET: 400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
});

describe("/api/articles", () => {
  test("Get 200 sends an array of article objects to the client, each of which contains all the required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((articleObj) => {
          expect(articleObj).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("/api/articles", () => {
  test("Get 200, the array of objects sent to the client contains the correct comment_count value, and doesn't have a body value", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const { articles } = body;
        expect(articles[0]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });
  test("Get 200, the articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("Get: 200 sends an array of comment objects to the client for the specified id, each of which has the correct properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const comments = body.comments;
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(3);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 3,
            })
          );
        });
      });
  });
  test("Get: 200 sends an array of comment objects to the client for the specified id with the correct key value pairs", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const comments = body.comments;
        expect(comments[0]).toEqual({
          comment_id: 15,
          body: "I am 100% sure that we're not completely sure.",
          article_id: 5,
          author: "butter_bridge",
          votes: 1,
          created_at: "2020-11-24T00:08:00.000Z",
        });
      });
  });
  test("Get: 200 sends an array of comment objects to the client for the specified id ordered by most recent comments first", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Get:200 sends an empty array when there are no comments for the specified id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const comments = body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  test("GET: 404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET: 404 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204, deletes the given comment by comment_id, responds with status 204 and no content", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(() => {
        return db.query(
          "SELECT * FROM comments WHERE comment_id = 2 ORDER BY created_at DESC;"
        );
      })
      .then((response) => {
        expect(response.rows).toEqual([]);
      });
  });
  test("DELETE 404, returns correct error when given a valid but non existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE 400, returns correct error when given invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("PATCH 200 responds with updated article", () => {
    const toUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(toUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 201 responds with updated article", () => {
    const toUpdate = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(toUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 201 responds with updated article", () => {
    const toUpdate = { inc_votes: -110 };
    return request(app)
      .patch("/api/articles/1")
      .send(toUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: -10,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 400 sends an appropriate and error message when given a malformed body", () => {
    const toUpdate = { inc_votes: "bannana" };
    return request(app)
      .patch("/api/articles/1")
      .send(toUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect body");
      });
  });
  test("PATCH 400 sends an appropriate and error message when given a body with the wrong type", () => {
    const toUpdate = {};
    return request(app)
      .patch("/api/articles/1")
      .send(toUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect body");
      });
  });
  test("PATCH: 404 sends an appropriate and error message when given a valid but non-existent id", () => {
    const toUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/999")
      .send(toUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("PATCH: 400 sends an appropriate and error message when given an invalid id", () => {
    const toUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(toUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("returns added comment for the article", () => {
    const addComment = {
      username: "butter_bridge",
      body: "Very good article",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(addComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            votes: 0,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: expect.any(String),
            article_id: 4,
          })
        );
      });
  });
});
test("POST 400 sends an appropriate and error message when given an invalid username", () => {
  const addComment = {
    username: "Bob101",
    body: "Boring article",
  };
  return request(app)
    .post("/api/articles/4/comments")
    .send(addComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("incorrect body");
    });
});
test("POST: 400 sends an appropriate and error message when given an invalid id", () => {
  const addComment = {
    username: "butter_bridge",
    body: "Very bad article",
  };
  return request(app)
    .post("/api/articles/not-an-id/comments")
    .send(addComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("invalid id");
    });
});
test("POST: 404 sends an appropriate and error message when given a valid but non-existent id", () => {
  const addComment = {
    username: "butter_bridge",
    body: "Very bad article",
  };
  return request(app)
    .post("/api/articles/99/comments")
    .send(addComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("article does not exist");
    });
});

describe("GET /api/users", () => {
  test("GET 200 responds with the correct array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { response } = body;
        expect(response).toHaveLength(4);
        response.forEach((obj) => {
          expect(obj).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("GET 200 responds with the correct array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { response } = body;
        expect(response[0]).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("topic query, filters articles by specificed topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("sort_by and order query, sorts by an valid column and order can be set to asc or desc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });
  test("sort_by and order query, sorts by an valid column and order can be set to asc or desc", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("sort_by and order query, sorts by an valid column and order can be set to asc or desc", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("sort_by and order query. order defaults to desc", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("sort_by and order query. sort_by defaults to created_at", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: false });
        expect(articles[2]).toEqual(
          expect.objectContaining({
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          })
        );
      });
  });
  test("multipled queries, correct array returned for multiple queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", { descending: false });
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toEqual("mitch");
        });
      });
  });
  test("GET 404. returns appropriate error when topic doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles?topic=asdfasf")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Resource not found");
      });
  });
  test("GET 400. returns appropriate error when given invalid query", () => {
    return request(app)
      .get("/api/articles?order=20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid order query");
      });
  });
  test("GET 400 returns appropriate error when given invalid query", () => {
    return request(app)
      .get("/api/articles?sort_by=asdf")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid sort query");
      });
  });
  test("GET 200 returns an empty array when given a topic that exists in the database, but where there are no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});

describe("/api/articles/:article_id (comment_count)", () => {
  test("GET 200 returns the correct object for the specified article_id with a comment count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({body}) => {
        const {article} = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            comment_count : 2
          })
        );
      });
  });
  test("GET 200 returns the correct object for the specified article_id with a comment count", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({body}) => {
        const {article} = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 2,
            comment_count : 0
          })
        );
      });
  });
  test("GET 200 returns the correct object for the specified article_id with a comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
        const {article} = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            comment_count : 11
          })
        );
      });
  });
});
