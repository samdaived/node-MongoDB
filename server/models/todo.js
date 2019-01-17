const mongoose = require('mongoose');


const todo =mongoose.model("todo",{
    text:{
        type: String,
        minlength:1,
        trim:true,
        required:true
    },
    complated:{
        type:Boolean,
        default:false
    },
    complatedAt:{
        type:Number,
        default:null
    }
});




module.exports={todo}