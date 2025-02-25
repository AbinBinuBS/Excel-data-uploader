import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './router/uploadRouter.js'
import connectDB from './config/db.js'
dotenv.config()
connectDB()
const port = process.env.PORT || 5000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/',router)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})