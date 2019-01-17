const {MongoClient, ObjectID }= require('mongodb');

const sam=ObjectID();
console.log(sam);

MongoClient.connect('mongodb://localhost:27017/TodoList',(err,client)=>{
    if(err){
        return console.log("unable to connect with the database");   
    }
    const db=client.db("TodoList");
    db.collection("TodoList").insertOne({
        meyou:"la",
        age:36,
        name:"samoil"
    });
    client.close()

})

