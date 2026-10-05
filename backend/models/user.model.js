const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    googleId: { type: String, unique: true, sparse: true },
    avatar: String,
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    password: {
      type: String,
      required: function () { return this.authProvider === "local"; },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);