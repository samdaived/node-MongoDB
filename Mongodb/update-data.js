const {MongoClient,ObjectID}= require('mongodb');


MongoClient.connect("mongodb://localhost:27017/TodoList",(err,client)=>{
    if(err){return console.log("sorry we cany connect")
    }
    const db =client.db("TodoList");
//     db.collection("TodoList").findOneAndUpdate({_id: new ObjectID('5c3353dbb53db409bc4bd48f')},
//    {$set: {
//         meyou:"LAura",
//         age:22,
//         name:"DDDOOO"
//     }},
//   { returnOriginal:false}).then(res=>{console.log(res)}).catch(er=>console.log(er)
//     );

db.collection("TodoList").findOneAndUpdate({_id: new ObjectID('5c3353dbb53db409bc4bd48f')},
{$inc: {
     
     age:1,
     
 }},
{ returnOriginal:false}).then(res=>{console.log(res)}).catch(er=>console.log(er)
 );
    client.close()
})