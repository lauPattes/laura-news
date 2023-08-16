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
      .then(({body}) => {
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
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          comment_count: 2
        })
      });
  });
  test("Get 200, he articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at",{descending : true})
      });
  })
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
        const comments = body.comments
        expect(comments).toBeSortedBy("created_at",{descending : true})
      });
  });
  test("Get:200 sends an empty array when there are no comments for the specified id",()=>{
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const comments = body.comments
        expect(comments).toHaveLength(0)
      })
  })
  test("GET: 404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  })
  test("GET: 404 sends an appropriate and error message when given an invalid id",()=>{
    return request(app)
    .get("/api/articles/not-an-id/comments")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("invalid id")
    })
  })
})

