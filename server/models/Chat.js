const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    sender: {
      type: String,
      default: "User",
    },

    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);