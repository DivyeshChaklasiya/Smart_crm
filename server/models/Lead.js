const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,

  status: {
    type: String,
    default: "New",
  },

  // 🔥 NEW FIELD (ADD THIS)
  notes: {
    type: String,
    default: "",
  },

  // 🔥 OPTIONAL (next feature ready 😎)
  priority: {
    type: String,
    default: "Medium", // High / Medium / Low
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  dueDate: Date,
});

module.exports = mongoose.model("Lead", leadSchema);