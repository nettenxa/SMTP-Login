import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ถ้าคุณเก็บ token / session สามารถลบตรงนี้ได้ เช่น localStorage.clear()
    navigate("/"); // กลับไปหน้า Login
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>ยินดีต้อนรับ 🎉</h1>
      <p>คุณเข้าสู่ระบบเรียบร้อยแล้ว</p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        LogOut
      </button>
    </div>
  );
}
