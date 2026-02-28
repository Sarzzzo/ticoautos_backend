require("dotenv").config();

const express = require("express");

//import the connection to the database
const connectDB = require('./src/config/db');

const app = express();

// Middleware: the server can understand JSON format, from frontend to backend
app.use(express.json());

// Routes of the application
app.use("/api/auth", require("./src/routes/authRoutes"));

// And, lets connect to the database
connectDB();

// this is a prueba route, so lets check if the server is working
app.get('/', (req, res) => { res.send('API Running') });

// the port, if the environment variable PORT is not defined, it will use 3000
const PORT = process.env.PORT || 3000; // this way is more secure 

// lets start the server
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });