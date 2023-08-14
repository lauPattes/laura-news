const {selectTopics, selectEndpoints} = require("./model")

exports.getTopics = (req,res) =>{
    selectTopics().then((topics)=>{
        res.status(200).send({topics})
    }).catch((err)=>{
        next(err)
    })
}

exports.getEndpoints = (req,res) =>{
    selectEndpoints()
    .then((endpoints)=>{
        res.status(200).send({endpoints})
    }).catch((err)=>{
        next(err)
    })

}
