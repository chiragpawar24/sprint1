const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const registerRoute = require("./routes/register");

const loginRoute = require("./routes/login");
const profileRoute = require("./routes/profile");
const mentorsRoute = require("./routes/mentors");
const mentorshipRequestRoute = require(
  "./routes/mentorshipRequests"
);
const messagesRoute = require("./routes/messages");
const notificationsRoute = require("./routes/notifications");
const jobsRoute = require("./routes/jobs");
const applicationsRoute = require("./routes/applications");
const reviewsRoute = require("./routes/reviews");
const sessionsRoute = require("./routes/sessions");
const candidatesRoute = require("./routes/candidates");
const interviewsRoute = require("./routes/interviews");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", profileRoute);
app.use("/api", mentorsRoute);
app.use("/api", mentorshipRequestRoute);
app.use("/api", messagesRoute);
app.use("/api", notificationsRoute);
app.use("/api", jobsRoute);
app.use("/api", applicationsRoute);
app.use("/api", reviewsRoute);
app.use("/api", sessionsRoute);
app.use("/api", candidatesRoute);
app.use("/api", interviewsRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("CareerConnect Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});