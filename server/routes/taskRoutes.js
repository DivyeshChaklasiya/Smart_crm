const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// ➕ Add Task
router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user.id,
  });
  res.json(task);
});

// 📋 Get Tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// 🔄 Update status
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

module.exports = router;