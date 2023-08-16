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
                status : "404",
                msg: `article does not exist`
            })
        }
        else{
            return article
        }
    })
}

exports.selectCommentsByArticleId = (article_id)=>{
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',[article_id])
    .then((result)=>{
        return result.rows
    })
}