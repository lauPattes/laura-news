const app = require("../server/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const fs = require("fs/promises");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
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
        const article = response.body.article
        const keysArr = Object.keys(article);
        expect(keysArr).toEqual(['article_id',
        'title',
        'topic',
        'author',
        'body',
        'created_at',
        'votes',
        'article_img_url']);
      });
  });
  test("GET: 404 sends an appropriate and error message when given a valid but non-existent id",()=>{
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then((response)=>{
      expect(response.body.msg).toBe('article does not exist')
    })
  })
  test.only("GET: 400 sends an appropriate error message when given an invalid id",()=>{
    return request(app)
    .get("/api/articles/not-an-id")
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("invalid id")
    })
  })
});