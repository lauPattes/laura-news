const db = require("../db/connection")
const articles = require("../db/data/test-data/articles")
const endpoints = require("../endpoints.json")
const fs = require("fs/promises")

exports.selectTopics = () =>{
    return db.query('SELECT * FROM topics;').then((result)=>{
        return result.rows
    })
}

exports.selectEndpoints = ()=>{
    return fs.readFile("endpoints.json","utf8").then((response)=>{
        return JSON.parse(response)
    })
}

exports.selectArticleById = (article_id)=>{
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;',[article_id])
    .then((result)=>{
        const article = result.rows[0]
        if(!article){
            return Promise.reject({
                status : 404,
                msg: "article does not exist"
            })
        }
        else{
            return article
        }
    })
}

exports.selectArticles = () =>{
    return db.query('SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;')
    .then((result)=>{
        return result.rows
    })
}
