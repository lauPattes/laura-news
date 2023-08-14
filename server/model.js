const db = require("../db/connection")
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
