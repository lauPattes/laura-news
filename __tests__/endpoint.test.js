const app = require("../server/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json")
const fs = require("fs/promises")

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
          expect(Object.keys(obj)).toEqual(
            expect.arrayContaining(["slug", "description"])
          );
        });
      });
  });
  test("Get 404 sends an appropriate error message when given an incorrect path", () => {
    return request(app).get("/api/topicZ").expect(404).then((response)=>{
        console.log(response.body.msg)
        expect(response.body.msg).toEqual("path not found")
    });
  });
});

describe("/api",()=>{
    test("Get 200 sends object to the client describing all the endpoints available",()=>{
        return request(app).get("/api")
        .expect(200)
        .then((response)=>{
            const gotFile = response.body.endpoints
            return fs.readFile("endpoints.json","utf8").then((readFile)=>{
                expect(gotFile).toEqual(JSON.parse(readFile))
            })
        })
    })
})