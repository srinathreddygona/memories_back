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


// const allowedOrigins = ['http://localhost:3000','https://memories-front-eta.vercel.app/']; // Replace with your frontend URL
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // Allows cookies to be sent with cross-origin requests
//   })
// );


app.use(cors());
app.use('/posts',postRoutes);
app.use('/user',userRoutes);
// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//     next();
//   });
  


const PORT=process.env.PORT || 5000;

//mongoose.set('debug',true);
mongoose.connect(process.env.CONNECTION_URL,{})
    .then(()=>app.listen(PORT,()=>console.log(` Server running on port: ${PORT}`)))
    .catch((error)=>console.log(error.message));

//mongoose.set('useFindAndModify',false);