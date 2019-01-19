const mongoose = require('mongoose');
const validator= require('validator');
const jwt =require('jsonwebtoken');
var _ = require('lodash');
const bcrypt = require('bcryptjs');


const UserSchema= new mongoose.Schema({
    email:{
        type: String,
        minlength:5,
        trim:true,
        required:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message: "{VALUE} is not valid email"
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true
    },
    tokens:[{
        access:{
            type:String,
            required:true,
        },
        auth:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON = function (){
    const userData=this;
    var userObject =userData.toObject();
    return _.pick(userObject,['_id','email'])
}


 UserSchema.methods.generateAuthToken= function (){


    var user=this;
   var access="auth";
    var auth= jwt.sign({_id: user._id.toHexString(),access},'123').toString();
    user.tokens = user.tokens.concat([{access,auth}]);
    var sam=auth;
    
    return user.save().then(()=>{return sam})
};

UserSchema.statics.findByToken = function (token) {
    var user = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'123')
    }
    catch {
        return Promise.reject()
    }
    return user.findOne({
        '_id':decoded._id,
        'tokens.auth':token,
        'tokens.access':'auth'})
};

UserSchema.statics.findByCredentials = function (email,password) {
    console.log("reach",email);
    var User1 = this;
   return User1.findOne({email:email}).then(user=>{
        if(!user){
            return Promise.reject()
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(er,re)=>{
                if(re){
                    resolve(user)
                }
                else{
                    reject()                   
                }
            })
        })
    })

}

UserSchema.pre('save', function (next){
    let user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(er,salt)=>{
            bcrypt.hash(user.password,salt,(er,hash)=>{
                user.password=hash;
                next()
            })
        })
    }
    else{
        next()
    }
})


const User =mongoose.model("users",UserSchema);
module.exports={User}