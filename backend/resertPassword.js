const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const hashedPassword = await bcrypt.hash(
      "chirag123",
      10
    );

    const result = await User.updateOne(
      { email: "chirag@gmail.com" },
      { $set: { password: hashedPassword } }
    );

    console.log("Password reset result:", result);
    console.log("New password: chirag123");

    await mongoose.disconnect();

  } catch (error) {
    console.log("Error:", error.message);
  }
}

resetPassword();