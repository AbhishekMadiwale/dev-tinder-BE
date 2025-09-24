const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishekmadiwale_db_user:AGmdlPuwyRiWWGk5@namastenode.fszoixf.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
