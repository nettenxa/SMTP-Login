// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// เก็บ OTP ชั่วคราว
const otpStore = {}; // { email: otp }
const OTP_TTL_MS = 5 * 60 * 1000; // 5 นาที

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint ส่ง OTP
app.post("/send_otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "กรุณากรอกอีเมล" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login OTP Code",
    text: `รหัส OTP ของคุณคือ: ${otp}\nโค้ดนี้หมดอายุใน 5 นาที`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[INFO] OTP sent to ${email}: ${otp}`);

    // ตั้งเวลาลบ OTP หลัง 5 นาที
    setTimeout(() => delete otpStore[email], OTP_TTL_MS);

    res.json({ success: true, message: "OTP ถูกส่งไปที่อีเมลของคุณแล้ว" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "ส่งอีเมลไม่สำเร็จ" });
  }
});

// Endpoint ตรวจสอบ OTP
app.post("/verify_otp", (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];
  if (!storedOtp) return res.json({ success: false, message: "ไม่พบ OTP สำหรับอีเมลนี้" });
  if (storedOtp !== otp) return res.json({ success: false, message: "OTP ไม่ถูกต้อง" });

  // ลบ OTP หลังยืนยัน
  delete otpStore[email];
  res.json({ success: true, message: "เข้าสู่ระบบสำเร็จ!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
