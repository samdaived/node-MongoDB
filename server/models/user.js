const mongoose = require('mongoose');
const validator= require('validator');
const jwt =require('jsonwebtoken');
var _ = require('lodash');


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
    var decod;
    try{
        decod = jwt.verify(token,'123')
    }
    catch {

    }
    return user.find({
        'tokens.access':'auth'}).then((ur)=>{
            return ur
        })
}


const User =mongoose.model("users",UserSchema);
module.exports={User}