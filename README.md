# Northcoders News API

Link to hosted version: https://laura-news.onrender.com

Summary of project: A news site with a range of different endpoints. Via the endpoints the user can view articles, topics, users and comments. The user can post comments on articles and like/dislike articles. They can also query the /api/articles endpoint to filter the articles (e.g. by topic, author, title, votes etc), and sort the articles according to any valid column (e.g. date, comment_count ect)

To try it for yourself clone the repo. 

Run "npm install" in the terminal

You then need to install the following as devDependencies:"husk", "jest","jest-extended","jest sorted", "supertest"

You also need to install the following as dependencies: "dotenv","express","pg","pg-format"

You will need to create two .env files '.env.test' and '.env.development'. 
In the .env.test file write PGDATABASE=nc_news_test
In .env.development file write PGDATABASE=nc_news


To setup the databases run the npm script "setup-dbs". Similarly to seed the database with the dev Data run "seed". To test your code using the test data run "test". 
To listen on port 9090 run "start". To assin the value of DATABASE_URL to  NODE_ENV, and then seed the data with the DevData, run "seed-prod".

"scripts": {
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
    "test": "jest",
    "prepare": "husky install",
    "start": "node listen.js",
    "seed-prod": "NODE_ENV=production npm run seed"
  },


For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).
