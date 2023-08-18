# Northcoders News API

Link to hosted version: https://laura-news.onrender.com

Summary of project: A news sit where the user can access different articles, comments. 

You need to install the following devDependencies

"devDependencies": {
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.14",
    "supertest": "^6.3.3"
}

You also need to install the following dependencies: 

"dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "pg": "^8.11.2",
    "pg-format": "^1.0.4"
  }


You will need to create two .env files .env.test and .env.development. 
Into .env.test, write PGDATABASE=nc_news_test
Into .env.development write PGDATABASE=nc_news


For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).
