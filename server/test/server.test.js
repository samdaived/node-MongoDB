const expect = require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');
const {app} = require('../server');
const {todo}=require('../models/todo');
const {User}=require('../models/user');
const {todopopulated,initialToDoData,userpopulated,initialUserData} = require('./seed/seed');

beforeEach(userpopulated);
beforeEach(todopopulated);


describe("Post /todo", ()=>{
    it("should save the data",(done)=>{
        const text="I will do it";
    request(app)
    .post('/todo')
    .send({text})
    .expect(200)
    .expect((res=>{ 
        expect(res.body.text).toBe(text)
    }))
    .end((err,res)=>{
        if(err){return done(err)}
        todo.find({text}).then(res=>{expect(res.length).toBe(1);
        done()
    })


    })})
    it("should not save invalid data",(done)=>{
        
        request(app)
        .post('/todo')
        .send({})
        .expect(400)
        .end((er,res)=>{
            if(er){return done(er)}
            todo.find({}).then(res=>{expect(res.length).toBe(2);done()}).catch(er=>done(er))
        })

    })
});

describe('Get /todo', ()=>{
    it('should get all the data',(done=>{
        
        request(app)
        .get('/todo')
        .expect(200)
        .expect(res=>{
                todo.find({}).then(re=>{expect(re.length).toBe(2)
                });
                     
        })
        .end(done) 

    }))
});


describe("Get /todo/:id",()=>{
    it("should accept valid id and return json of the Id",(done)=>{
        request(app)
        .get(`/todo/${initialToDoData[0]._id.toHexString()}`)
        .expect(200)
        .expect(res=>{
            expect(res.body.re.text).toBe(initialToDoData[0].text)
        })
        .end(done)
    });
    it("Should reject the invalid data",(done)=>{
        request(app)
        .get('/todo/343')
        .expect(400)
        .end(done)
    });
    it("Should reject the unfound data",(done)=>{
        request(app)
        .get(`/todo/${new ObjectID()} `)
        .expect(404)
        .end(done)
    })
});

describe("Delet /todo/:id",()=>{
    it("should accept valid Id and delet the object",(done)=>{
        var hexid=initialToDoData[0]._id.toHexString();
        request(app)
        .delete(`/todo/${hexid}`)
        .expect(200)
        .expect(res=>{
            expect(res.body._id).toBe(hexid);
            
        })
        .end((er,res)=>{
            if(er){
                return done(er)
            } ;
           
            todo.findById(hexid).then(todos=>{
                expect(todos).toBe(null);
                done()
            }).catch(er=>done(er))
        })
    });
    it("should  return 404 if Id is not found",(done)=>{
        request(app)
        .delete(`/todo/${new ObjectID()}`)
        .expect(404)
        .end(done)
    });
    it("should  return 400 if Id is not valid",(done)=>{
        request(app)
        .delete(`/todo/123`)
        .expect(400)
        .end(done)
    })
});

describe("Patch /todo",()=>{
    it("should update valid data",done=>{
        request(app)
        .patch(`/todo/${initialToDoData[0]._id.toHexString()}`)
        .send({
            complated:true,
            text:"hell work"
        })
        .expect(200)
        .expect(todo=>{
            expect(todo.body.text).toBe("hell work")
            expect(todo.body.complated).toBe(true),
            expect(todo.body.complatedAt-new Date()).toBeLessThan(0)
            expect(todo.body.complatedAt-new Date()).toBeGreaterThan(-200)

        })
        .end(done)
    });
    it("shouldnt update if not found",(done)=>{
        request(app)
        .patch(`/todo/${new ObjectID()}`)
        .send({
            complated:true,
            text:"hell work"
        })
        .expect(404)
        .end(done)
    });
    it("shouldnt update invalid data",(done)=>{
        request(app)
        .patch('/todo/545')
        .expect(404)
        .end(done)
    })
});

const email='sasasa@dsddd.com';
const password='fdgdffdg233';

describe("/post users",()=>{
   
    it('shuold save the the new user',(done)=>{
       
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers["x-auth"]).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
            expect(res.body.password).not.toBe(password);
            
        })
        .end((er)=>{
            if(er){
               return done(er)
            }
            User.findOne({email}).then(re=>{
                expect(re.email).toBe(email);
                done()
            })
        })
    });
    it('should"nt save invalid email',(done)=>{
        request(app)
        .post('/users')
        .send({email:initialUserData[0].email,password:initialUserData[0].password})
        .expect(400)
        .end(done)

    } )
});

describe('/get users/me',()=>{
    it('should get back the users data',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',initialUserData[0].tokens[0].auth)
        .expect(200)
        .expect(user=>{ 
            expect(user.body._id).toBe(initialUserData[0]._id.toHexString())
        })
        .end(done)
    });
    it('should"nt stop invalid token',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',"fdgdfgdfgdfg")
        .expect(401)
        .end(done)
    })
});


describe('Post /users/login log in',()=>{
    it('should accept exist users',(done)=>{
        request(app)
        .post('/users/login')
        .send({email:initialUserData[0].email,password:initialUserData[0].password})
        .expect(200)
        .expect((us)=>{
            expect(us.headers['x-auth']).toBeTruthy()
        })
        .end((er,re)=>{
        if(er){ return done(er) }
        done()})
    });
    it('should"nt accept invalid users',(done)=>{
        request(app)
        .post('/users/login')
        .send({email:initialUserData[0].email,password:initialUserData[0].password+43})
        .expect(401)
        
        .end(done)})
});

describe('Post /users/me/token',()=>{
    it("should delete tokens",(done)=>{

        request(app)
        .post('/users/me/token')
        .set('x-auth',initialUserData[0].tokens[0].auth)
        .expect(200)
        .end((er,re)=>{
            if(er){return done(er)}
            User.findOne({_id:initialUserData[0]._id}).then(user=>{
                expect(user.tokens.length).toBe(0);
                done()
            })
        })
    })
})