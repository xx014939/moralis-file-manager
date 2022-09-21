require("dotenv").config({ path: "./config.env" });

var cors = require('cors')
const express = require('express')
const app = express()
app.use(cors())
app.options('*', cors());
const mongoose = require('mongoose')
 

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const usersRouter = require('./routes/userRoutes')
app.use('/', usersRouter)

app.listen(process.env.PORT, () => console.log('Server Started - PORT:', process.env.PORT))