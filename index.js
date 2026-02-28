require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Middleware: the server can understand JSON format, from frontend to backend
app.use(express.json());

// Routes of the application
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/vehicles", require("./src/routes/vehicleRoutes"));

// Conexión Mongo
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log('Error MongoDB:', error);
});

database.once('connected', () => {
    console.log('Database Connected');
});

// this is a prueba route, so lets check if the server is working
app.get('/', (req, res) => { res.send('API Running') });

// the port, if the environment variable PORT is not defined, it will use 3000
const PORT = process.env.PORT || 3000; // this way is more secure 

// lets start the server
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });