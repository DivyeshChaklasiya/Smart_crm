const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// 🔹 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required ⚠️" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User Registered ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "Enter email & password ⚠️" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 GET PROFILE
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 UPDATE PROFILE
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({ message: "Profile updated ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email & new password required ⚠️" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/change-password", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;