{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require("express");\
const bodyParser = require("body-parser");\
const fs = require("fs");\
\
const app = express();\
app.use(bodyParser.json());\
\
const USERS_FILE = "users.json";\
\
// Load users\
function loadUsers() \{\
  if (!fs.existsSync(USERS_FILE)) return \{\};\
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));\
\}\
\
// Save users\
function saveUsers(users) \{\
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));\
\}\
\
// \uc0\u55357 \u56594  1. Webhook from Ko-fi\
app.post("/webhook", (req, res) => \{\
  const data = req.body;\
  const email = data.email;\
\
  if (!email) return res.status(400).send("Missing email");\
\
  const users = loadUsers();\
  users[email] = data.tier_name ? true : false; // true if subscribed\
  saveUsers(users);\
\
  res.send("OK");\
\});\
\
// \uc0\u55357 \u56589  2. App checks subscription\
app.get("/check", (req, res) => \{\
  const email = req.query.email;\
  const users = loadUsers();\
\
  const status = users[email] || false;\
  res.json(\{ subscribed: status \});\
\});\
\
const PORT = process.env.PORT || 3000;\
app.listen(PORT, () => \{\
  console.log("Server running on port " + PORT);\
\});\
}