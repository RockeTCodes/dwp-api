const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dwp_api", {});
    console.log("Connected to dwp db.");
  } catch (e) {
    console.log(e, "Failed to connect to dwp db.");
  }
};

module.exports = connectDb;
