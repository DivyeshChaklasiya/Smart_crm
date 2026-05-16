const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const auth = require("../middleware/auth");


// 🔥 GET ALL NOTIFICATIONS
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 MARK AS READ
router.put("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    notification.read = true;

    await notification.save();

    res.json({ message: "Notification read ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;