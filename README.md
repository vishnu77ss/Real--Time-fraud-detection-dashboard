# 🛡️ Fraud Guard: Real-Time AI Fraud Detection Dashboard

**Fraud Guard** is a high-performance MERN stack application designed to monitor e-commerce transactions in real-time. By integrating **Google Gemini 1.5 Flash AI**, the system provides instant risk analysis and anomaly detection to prevent fraudulent activity before it occurs.

---

## 📺 Project Preview

![Live Dashboard](./dashboard-main.png)
_Real-time transaction monitoring with live status updates._

![Risk Trends](./risk-trends.png)
_Visualizing AI-generated risk scores using Redux and Chart.js._

---

## 🚀 Core Features

- **Real-Time Streaming:** Leveraging **Socket.io** for sub-second data updates.
- **AI Analysis:** Every transaction is analyzed by **Google Gemini AI** to provide a risk score and reasoning.
- **Global State Management:** Uses **Redux Toolkit** to synchronize live data across charts and tables.
- **Secure Access:** Enterprise-grade **JWT Authentication** and password hashing with **Bcrypt.js**.
- **Data Persistence:** Optimized for **MongoDB Atlas** for historical trend analysis.

## 🛠️ Tech Stack

- **Frontend:** React.js, Redux Toolkit, Chart.js, Lucide Icons.
- **Backend:** Node.js, Express.js, Socket.io, JWT.
- **Database:** MongoDB Atlas (Certified).
- **AI Engine:** Google Generative AI (Gemini 1.5 Flash).

## 📦 Installation & Setup

1. **Clone the repository**
2. **Server Setup:**
   - Navigate to `/server`
   - Run `npm install`
   - Create a `.env` file with your `MONGO_URI`, `GEMINI_API_KEY`, and `JWT_SECRET`.
   - Start with `npx nodemon index.js`
3. **Client Setup:**
   - Navigate to `/client`
   - Run `npm install`
   - Start with `npm start`

---

**Developed by Mediboina Vishnu Murthy** _MERN Stack Developer & MongoDB Certified Associate Developer_
