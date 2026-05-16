const cron = require("node-cron");
const Lead = require("../models/Lead");
const sendEmail = require("./sendEmail");

// 🔥 DAILY RUN (every day 9 AM)
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily reminder job...");

  try {
    const leads = await Lead.find({
      dueDate: { $lt: new Date() },
    });

    for (let lead of leads) {
      await sendEmail(
        lead.email,
        "Daily Reminder ⚠️",
        `Hi ${lead.name}, this is your daily reminder. Your lead is still pending.`
      );
    }

    console.log("✅ Daily emails sent");
  } catch (error) {
    console.log("❌ Cron error:", error);
  }
});