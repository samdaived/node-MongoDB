const {ObjectID}=require('mongodb');
const {todo}=require('../../models/todo');
const {User}=require('../../models/user');
 const jwt = require('jsonwebtoken');

const userOneId=new ObjectID();
const userTwoId=new ObjectID();

var initialToDoData = [
    {text:'trying',
    _id:new ObjectID(),
    _creator:userOneId,
    complated:false,
    complatedAt:null}
    ,
    {text:'trying aging',
    _id:new ObjectID(),
    _creator:userTwoId,
    complated:true,
    complatedAt:234
    }
];


const initialUserData=[{
        _id:userOneId,
        email:"sam@sds.cdf",
        password:"123ewqwer",
        tokens:[{
            access:"auth",
            auth: jwt.sign({_id:userOneId,access:"auth"},'123').toString()
        }]
    },{
        _id:userTwoId,
        email:"sam2@sds.cdf",
        password:"1232ewqwer",
    } ];

const userpopulated=done=>{
    User.remove({}).then(()=>{
        const userOne =new User(initialUserData[0]).save();
        const userTwo =new User(initialUserData[1]).save();

        return Promise.all([userTwo,userOne])
    }).then(()=>{
        done()
    })
}

const todopopulated=done=>{
    todo.remove({}).then(()=>{
       return todo.insertMany(initialToDoData)
    }).then(res=> done())
};



module.exports={todopopulated,initialToDoData,userpopulated,initialUserData}