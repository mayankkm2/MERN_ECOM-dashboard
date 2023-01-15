const express = require('express');
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product');
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm'; 
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
/* app.get('/', (req,res) => {//res.send() function basically sends the HTTP response
 res.send('working');
}); */
app.post('/register',async (req,res) => {
    let user = new User(req.body);
    let result = await user.save();//save metd retrn promise
    result = result.toObject();//paswrd in response nt good practice,so remv
    delete result.password;//later apply validton,like no same/empty email, 
    //res.send(result); //This function accepts a single parameter body that describe the body which is to be sent in the response.//it forwrd any data passd as an arg to client side
    Jwt.sign({result},jwtKey, { expiresIn: "2h"},(err, token) => { //1st arg user data jo send karna
        if (err) {
         res.send({result:"somethng went wrng. Please try aftr some time"});
        }
         res.send({result , auth: token});
     })
});
//save ya send ke liye post route use karte h
app.post('/login',async (req, res) => {
    console.log(req.body);
    if(req.body.password && req.body.email) { //if we wnt to send both pass nd email
        let user = await User.findOne(req.body).select('-password');//matches one, but dont want passw
    if(user) {
        //if we get user
        Jwt.sign({user},jwtKey, { expiresIn: "2h"},(err, token) => { //1st arg user data jo send karna
           if (err) {
            res.send({result:"somethng went wrng. Please try aftr some time"});
           }
            res.send({user , auth: token});
        })
 
        
    } else {//if no match found
       res.send({rult:"no useer found"}); 
       }

    } else {
        res.send({result:"no useer found"}); 
    }
    
   
})

 app.post('/add-product',verifyToken ,async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
 })
 //jab data get karte h database se tb get route
app.get('/products',verifyToken ,async (req, res) => {
    let products =await Product.find();//reada all and puts in var products
    if(products.length>0) {
        res.send(products);
    }else {
        res.send({result:"no products found"});
    }
  })

 app.delete('/product/:id',verifyToken,async (req, res) => { 
 //res.send(req.params);//o/p- {id: 'rsdsgghh4sfxdd'}
 const result =await Product.deleteOne({_id:req.params.id});
 res.send(result);
 }) 
//api for get single product -update#1 
 app.get('/product/:id',verifyToken ,async (req, res) => {
  let result = await Product.findOne({_id: req.params.id});
  if(result){
    res.send(result)
  } else{
    res.send('no record found')
  }
});
//api for update
app.put('/product/:id',verifyToken,async (req,res) => {//update#2
 let result = await Product.updateOne(
    {_id: req.params.id},
    {$set: req.body}
    );
    res.send(result);
})

app.get('/search/:key',verifyToken ,async (req,res) => {
 let result = await Product.find({
    "$or":[
        { name:{$regex: req.params.key}},
        { company:{$regex: req.params.key}},
        { category:{$regex: req.params.key}}
    ]
 })
 res.send(result);
})
//Basic middleware behaviour:
//For valid token, it sets the user in context and calls next handler.For invalid token, it sends “401 - Unauthorized” response.
function verifyToken(req, res, next) {//middleware , USE DIS WID DIFFERENT API
    let token = req.headers['authorization'];//send tokn wid postman nd verifyin tkn usin middleware
 if(token) { //takin token out of bearer nd token to verify,to see if its workin
  token = token.split(' ')[1];//we get arrays
  console.log("middleware called", token); 
  Jwt.verify(token, jwtKey, (err,valid) => {
    if(err) {
        res.status(401).send({result : 'please provide valid token'}) //can add status-invalid
    }else {
        next();//goes to route/api
  }
}) 

 } else {//wen no token
    res.status(403).send({result : 'please add token with header'})//status 403- no status al all
}
 
 // console.log("middleware called", token);
 //next();//now it ll call d search api route later it goes to route
}

app.listen(5000);//app.listen() method binds itself with the specified host and port to bind and listen for any connections.

 