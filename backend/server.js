const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConnect = require('./config/dbConnection');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
//app.use(express.static('public'))
app.use('/images', express.static('public/images'));


//dotenv conig
dotenv.config();

// MongoDB Connection
dbConnect();

//routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/waste", require("./routes/wasteRoutes"));
app.use("/api/food", require("./routes/foodList"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/shoppinList", require("./routes/shoppingListRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
