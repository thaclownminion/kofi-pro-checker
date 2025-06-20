const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

const USERS_FILE = "users.json";

// Load users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 🔒 1. Webhook from Ko-fi
app.post("/webhook", (req, res) => {
  const data = req.body;
  const email = data.email;

  if (!email) return res.status(400).send("Missing email");

  const users = loadUsers();
  users[email] = data.tier_name ? true : false; // true if subscribed
  saveUsers(users);

  res.send("OK");
});

// 🔍 2. App checks subscription
app.get("/check", (req, res) => {
  const email = req.query.email;
  const users = loadUsers();

  const status = users[email] || false;
  res.json({ subscribed: status });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
