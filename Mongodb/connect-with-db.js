const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/TodoList',(err,cleint)=>{
    if(err){
        return console.log("unable To connect");
    }
    const db=cleint.db("TodoList");
    db.collection("Todolist").insertOne({
        name:"dfsf",
       
    },(err,res)=>{
        if(err){
            return console.log("unable to add"+err);
        } 
    console.log(res.ops[0]._id.getTimestamp());
    
    });

    cleint.close();
})