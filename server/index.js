/** @format */

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import AuthRouter from './Routers/AuthRoute.js'
import UserRouter from './Routers/UserRouter.js'
import PostRouter from './Routers/PostRoute.js'
import UploadRouter from './Routers/UploadRoute.js'
import cors from 'cors'
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
}))

dotenv.config()

mongoose
  .connect(
    process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log("Listening");
    })
  ).catch((error)=> console.log(error))



  app.use('/auth',AuthRouter)

  app.use('/user',UserRouter)

  app.use('/posts',PostRouter)

  app.use('/upload',UploadRouter)

  

