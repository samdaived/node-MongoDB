const {MongoClient } = require('mongodb');

MongoClient.connect("mongodb://localhost:27017",(er,client)=>{
if(er){
    return console.log("soory we cant connect")   
}
const db = client.db('TodoList');
// db.collection("TodoList").deleteMany({name:'dfsf'}).then(res=>console.log(res)
// ).catch(er=>console.log(er)
// )


// db.collection("TodoList").deleteOne({meyou:'SDf'}).then(res=>console.log(res)
// ).catch(er=>console.log(er)
// )

db.collection("TodoList").findOneAndDelete({meyou:'SDf'}).then(res=>console.log(res)
).catch(er=>console.log(er)
)


})