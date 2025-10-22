import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  // นับถอยหลัง
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/verify_otp",
        new URLSearchParams({ email, otp })
      );
      if (res.data.success) {
        setMessage(res.data.message);
        setSuccess(true);
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMessage(res.data.message);
        setSuccess(false);
      }
    } catch (err) {
      setMessage("เกิดข้อผิดพลาด");
      setSuccess(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/send_otp",
        new URLSearchParams({ email })
      );
      if (res.data.success) {
        setMessage(res.data.message);
        setTimer(300); // รีเซ็ตนับถอยหลัง
        setCanResend(false);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("ส่ง OTP ใหม่ไม่สำเร็จ");
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="container">
      <h2>ยืนยันรหัส OTP</h2>
      <p>อีเมล: {email}</p>
      <input
        type="text"
        placeholder="กรอกรหัส OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {/* ปุ่มยืนยันจะหายไปเมื่อ timer หมด */}
      {!canResend && (
        <button onClick={handleVerify}>ยืนยัน</button>
      )}

      {message && <p className={`message ${success ? "success" : "error"}`}>{message}</p>}

      <div className="timer">
        {canResend ? (
          <button onClick={handleResend}>ส่ง OTP ใหม่</button>
        ) : (
          <p>เวลาที่เหลือในการกรอก OTP: {formatTime(timer)}</p>
        )}
      </div>
    </div>
  );
}
