const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');

const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
// const authenticate = require('authenticate')

dotenv.config({ path:'./config.env' });
require('./db/conn');
// const User = require('./model/userSchema');


app.use(express.json());
app.use(require('./router/auth'));


const PORT = process.env.PORT || 5000;



app.get('/',(req,res)=>{
    res.send("Hello from server")
});



app.get('/signup', (req, res) => {
    res.send(`Hello Registration world from the server`);
});


if(process.env.NODE_ENV == "production")
{
    app.use(express.static("client/build"))
}

app.listen(5000,()=>{
    console.log(`server is running at port no. ${PORT}`);
})