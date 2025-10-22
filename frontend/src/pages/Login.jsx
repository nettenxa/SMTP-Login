import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/send_otp",
        new URLSearchParams({ email })
      );
      if (res.data.success) {
        setMessage(res.data.message);
        localStorage.setItem("email", email);
        setTimeout(() => navigate("/verify"), 1000);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("ส่งอีเมลไม่สำเร็จ");
    }
  };

  return (
    <div className="container">
      <h2>เข้าสู่ระบบ</h2>
      <input
        type="email"
        placeholder="กรอกอีเมลของคุณ"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOTP}>ส่งรหัสไปที่อีเมล</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
