import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js'; 
import userRoutes from './routes/users.js'; 

import dotenv from 'dotenv';

const app=express();
dotenv.config();

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

app.use(cors());
app.use((req, res, next) => {
    console.log("🟡 Incoming Request:", req.method, req.url);
    next();
});
app.use('/posts',postRoutes);
app.use('/user',userRoutes);


const PORT=process.env.PORT || 5000;

//mongoose.set('debug',true);
mongoose.connect(process.env.CONNECTION_URL,{})
    .then(()=>app.listen(PORT,()=>console.log(` Server running on port: ${PORT}`)))
    .catch((error)=>console.log(error.message));




//mongoose.set('useFindAndModify',false);
