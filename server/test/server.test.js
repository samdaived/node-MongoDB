const expect = require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');
const {app} = require('../server');
const {todo}=require('../models/todo');

var initialData = [
    {text:'trying',
    _id:new ObjectID(),
    complated:false,
    complatedAt:null}
    ,
    {text:'trying aging',
    _id:new ObjectID(),
    complated:true,
    complatedAt:234
    }
];

beforeEach(done=>{
    todo.remove({}).then(()=>{
       return todo.insertMany(initialData)
    }).then(res=> done())
});


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
        .get(`/todo/${initialData[0]._id.toHexString()}`)
        .expect(200)
        .expect(res=>{
            expect(res.body.re.text).toBe(initialData[0].text)
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
        var hexid=initialData[0]._id.toHexString();
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
        .patch(`/todo/${initialData[0]._id.toHexString()}`)
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
})