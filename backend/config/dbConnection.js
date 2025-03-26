const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log(`Mongodb connected`);
    } catch (error) {
      console.log(`Mongodb Connection Error, ${error}`);
    }
  };
  
  module.exports = connectDB;