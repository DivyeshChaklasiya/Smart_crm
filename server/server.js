require("dotenv").config();

require("./utils/cronJobs");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");

const notificationRoutes = require("./routes/notificationRoutes");

// 🔥 EMAIL IMPORT
const sendEmail = require("./utils/sendEmail");

const app = express();

/* HTTP SERVER */
const server = http.createServer(app);

const Chat = require("./models/Chat");

/* EXPRESS CORS */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());


/* SOCKET.IO */
const io = new Server(server, {

  cors: {

    origin: "*",

    methods: ["GET", "POST"],

  },

});

/* SOCKET CONNECTION */
io.on("connection", (socket) => {

  console.log("User connected 🔥");

  /* LOAD OLD MESSAGES */
  Chat.find()
    .sort({ createdAt: 1 })
    .then((messages) => {

      socket.emit("load_messages", messages);

    });

  /* SEND MESSAGE */
  socket.on("send_message", async (data) => {

    console.log("Message:", data);

    /* SAVE TO DB */
    const newMessage = new Chat({

      text: data.text,

      sender: "User",

      time: data.time,

    });

    await newMessage.save();

    /* SEND TO ALL */
    io.emit("receive_message", newMessage);

  });

  socket.on("disconnect", () => {

    console.log("User disconnected ❌");

  });

});

/* MIDDLEWARE */
app.use(express.json());

/* MONGODB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err.message));

/* TEST EMAIL */
sendEmail(
  "chaklasiyadivyesh@gmail.com",
  "Test Email 🚀",
  "CRM Email system working che 🔥"
);

/* ROUTES */
app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/leads", require("./routes/leadRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.use("/api/notifications", notificationRoutes);

/* AUTH */
const auth = require("./middleware/auth");

app.get("/api/protected", auth, (req, res) => {

  res.json({

    message: "Protected data ✅",

    user: req.user,

  });

});

/* TEST ROUTE */
app.get("/", (req, res) => {

  res.send("CRM API Running...");

});

/* SERVER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT} 🚀`);

});
