const {MongoClient,ObjectID}=require('mongodb');


MongoClient.connect("mongodb://localhost:27017/TodoList",(er,client)=>{
    if(er){
        return console.log("sorry we couldnt connect");
        
    }
    const db=client.db("TodoList");
    db.collection('todolist').find({ name: 'dfsf'}).count().then((res)=>{
        console.log(res
    )}).catch(er=>console.log(er)
    );

    client.close()

})