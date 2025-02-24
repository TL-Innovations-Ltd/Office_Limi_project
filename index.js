const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./src/connection/DB_connection');

const user_routes = require('./src/client/user/routes');

app.use(express.json());

connectDB();

app.use('/client' , user_routes);


app.listen( process.env.PORT ,() => console.log('🌐 Server is running on port 3000'));