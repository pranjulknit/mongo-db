const express = require('express');
const {UserModel, TodoModel} = require("./db");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');

mongoose.connect("mongodb+srv://pranjul:H5WkyAfg3PQJ7Fd6@mern-estate.xbjbvdi.mongodb.net/");


const app = express();



app.use(express.json());

const JWT_SECRET = "secrethaimerijaan";


//middileware for auth

function auth(req,res,next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token);

    if(decodedData){
        req.userId = decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            message:"Incorrect details"
        })
    }
    
}

app.post("/signup",async (req,res)=>{

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password:password,
        name:name
    });

    res.json({message: "u are signed up"});

})

app.post("/signin",async (req,res)=>{

    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email:email,
        password:password

    });

    if(user){
        const token = jwt.sign({
            id:user._id.toString()
        },JWT_SECRET);

        res.json({
            token: token
        });

    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }

})

app.post("/todo",auth,(req,res)=>{

    const userId = req.userId;
    const title = req.body.title;

    TodoModel.create({
        title,
        userId
    })

    res.json({
        userId:userId
    })

})

app.get("/todos",auth,async(req,res)=>{
    const userId = req.userId;

    const users = await TodoModel.find({userId:userId});
    res.json({todos});
})



app.listen(5001,()=>{
    console.log("server is running");
})