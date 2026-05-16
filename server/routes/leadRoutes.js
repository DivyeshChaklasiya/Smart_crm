const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");

const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/Notification");

// 🔹 CREATE LEAD + AUTO EMAIL
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, dueDate, notes, priority } = req.body;

    const lead = new Lead({
      name,
      email,
      phone,
      dueDate,
      notes,       // 🔥 ADD
      priority,    // 🔥 READY FOR NEXT FEATURE
      user: req.user.id,
    });

    await lead.save();
    await Notification.create({
  message: `New lead added: ${name}`,
  user: req.user.id,
});

    await sendEmail(
      email,
      "Welcome to Smart CRM 🚀",
      `Hello ${name}, your lead has been added successfully!\n\nWe will contact you soon.`
    );

    res.json({ message: "Lead created ✅", lead });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


// 🔥 GET LEADS
router.get("/", auth, async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = { user: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 UPDATE LEAD (FIXED)
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, email, phone, status, dueDate, notes, priority } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found ❌" });

    if (lead.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed ❌" });
    }

    // 🔥 UPDATE ALL FIELDS
    lead.name = name || lead.name;
    lead.email = email || lead.email;
    lead.phone = phone || lead.phone;
    lead.status = status || lead.status;
    lead.dueDate = dueDate || lead.dueDate;
    lead.notes = notes !== undefined ? notes : lead.notes; // 🔥 FIX
    lead.priority = priority || lead.priority; // 🔥 NEXT FEATURE READY

    await lead.save();

    if (status) {
  await Notification.create({
    message: `${lead.name} status changed to ${status}`,
    user: req.user.id,
  });
}
    res.json({ message: "Lead updated ✅", lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found ❌" });

    if (lead.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed ❌" });
    }

    await lead.deleteOne();

    res.json({ message: "Lead deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 STATS
router.get("/stats", auth, async (req, res) => {
  try {
    const total = await Lead.countDocuments({ user: req.user.id });

    const newLeads = await Lead.countDocuments({
      user: req.user.id,
      status: "New",
    });

    const contacted = await Lead.countDocuments({
      user: req.user.id,
      status: "Contacted",
    });

    const converted = await Lead.countDocuments({
      user: req.user.id,
      status: "Converted",
    });

    const overdue = await Lead.countDocuments({
      user: req.user.id,
      dueDate: { $lt: new Date() },
    });

    res.json({
      total,
      newLeads,
      contacted,
      converted,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 REMINDER
router.get("/send-reminders", async (req, res) => {
  try {
    const leads = await Lead.find({
      dueDate: { $lt: new Date() },
    });

    for (let lead of leads) {
      await sendEmail(
        lead.email,
        "Follow-up Reminder ⚠️",
        `Hi ${lead.name}, this is a reminder that your lead is overdue.`
      );
    }

    res.json({ message: "Reminder emails sent ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 GET SINGLE LEAD
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found ❌" });
    }

    if (lead.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed ❌" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;