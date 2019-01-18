const {User}=require('../models/user');


var authenticated =(req,res,next)=>{
    let token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){return Promise.reject()}        
         req.user=user;
         req.token=token;
         next();
    }).catch(er=>
        res.status(401).send(er))
};

module.exports={authenticated};