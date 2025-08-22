const express = require('express');
const dotenv = require('dotenv');
const router = require('./src/routes/auth.routes');
const connectDB = require('./src/config/database');
const path = require('path');
dotenv.config();
connectDB();
const PORT = process.env.PORT;
const app = express();



app.use('/public',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use('/api/auth',router);

app.listen(PORT,console.log('server is start at port ',PORT));