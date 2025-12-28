require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

// FIX: Updated CORS to allow any local connection during development
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

const MOCK_USER = { email: "manager@store.com", password: "password123" };

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: "Invalid Credentials" });
});

async function analyzeTransaction(tx) {
  try {
    const prompt = `Analyze this e-commerce transaction for fraud: Amount: $${tx.amount}, Location: ${tx.location}. Return ONLY a JSON object: {"riskScore": number, "reason": "string"}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { riskScore: 25, reason: "Manual check suggested" };
  } catch (error) {
    return { riskScore: 50, reason: "AI Service Busy" };
  }
}

setInterval(async () => {
  const transaction = {
    id: Math.floor(Math.random() * 1000000),
    amount: (Math.random() * 5000).toFixed(2),
    location: ["New York", "Mumbai", "London", "Tokyo", "Berlin"][
      Math.floor(Math.random() * 5)
    ],
    time: new Date().toLocaleTimeString(),
  };
  const analysis = await analyzeTransaction(transaction);
  const fullData = { ...transaction, ...analysis };
  io.emit("new-transaction", fullData);
  console.log("Sent live transaction:", fullData);
}, 10000);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
