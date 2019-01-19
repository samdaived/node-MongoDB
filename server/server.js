
const {mongoose} = require('./db/mongoose');
const _=require('lodash');
const express = require('express');
const bodyParser=require('body-parser');
const {ObjectID} =require('mongodb');

const {User}= require('./models/user');
const {todo}= require('./models/todo');
const {authenticated} = require('./middleware/authentication');

const app = express();
app.use(bodyParser.json());


app.post('/todo',(req,res)=>{
    const newtodo= new todo({text:req.body.text});
    newtodo.save().then(doc=>res.status(200).send(doc)).catch(e=>res.status(400).send(e))
});

app.get('/todo',(req,res)=>{
    todo.find({}).then(doc=>{
        if(doc.length===0){
            return res.status(404).send()
        }
        res.status(200).send({doc})
    }).catch(er=>res.status(400).send(er))
});

app.get('/todo/:id',(req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(400).send()
    }
    todo.findById(id).then(re=>{
        if(!re){
            res.status(404).send()
        }
        res.status(200).send({re})
    }).catch(er=>console.log(er)
    )

});

app.delete('/todo/:id',(req,res)=>{
var id = req.params.id;

if(!ObjectID.isValid(id)){
    return res.status(400).send();
}

todo.findByIdAndRemove(id).then(re=>{
    if(!re){return res.status(404).send()}
    res.status(200).send(re)
}).catch(er=>{res.status(400).send(er)
})


});

app.patch('/todo/:id',(req,res)=>{
    const Id=req.params.id;
    const body=_.pick(req.body,['text','complated']);

    if(!ObjectID.isValid(Id)){
        return res.status(404).send()
    };

    if(_.isBoolean(body.complated)&&body.complated){
        body.complatedAt=new Date();
    }
    else{
        body.complated=false;
        body.complatedAt=null
    }
    todo.findByIdAndUpdate(Id,{$set:body},{new:true}).then(re=>{
        if(!re){ return res.status(404).send()}
        res.status(200).send(re)
    }).catch(er=>{
        res.status(400).send(er)
    })
});

app.post('/users',(req,res)=>{
    const UserData= _.pick(req.body,['email','password']);
    const NewUser= new User(UserData);
    NewUser.save()
    .then(()=>{
       return NewUser.generateAuthToken()})
    .then((a)=>{
            
            res.header("x-auth",a).send(NewUser)
        })
    .catch(e=> res.status(400).send(e))
    });


    
app.get('/users/me',authenticated,(req,res)=>{
    res.send(req.user)
});

app.post('/users/login',(req,res)=>{
    const body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then(user=>{
        user.generateAuthToken().then(a=>{
            res.header('x-auth',a).send(user)
        }

        )
        
    }).catch(er=>res.status(400).send(er)
    )
})
   


app.listen(3000,()=>{
    console.log("port 3000");
 
});


module.exports={app}