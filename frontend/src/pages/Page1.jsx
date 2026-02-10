import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import "./Page1.css";

function Page1() {
  useAuthTimeout();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get(`http://localhost:5000/api/id/${id}`, { headers: { token } })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!user)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-warning"
          role="status"
          style={{ width: "5rem", height: "5rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
    <section className="home-page">
      <div className="app">
        {/* Sidebar (ของเดิม ไม่แก้) */}
        <nav className="sidebar">
          <div className="profile">
            <div className="avatar">👤</div>
            <div>
              <p className="username">{user.name}</p>
              <p className="userid">ID: {user._id}</p>
            </div>
          </div>

          <h1 className="app-title">การเงินของฉัน</h1>

          <ul className="menu">
            <li
              onClick={() => {
                navigate(`/Home/${user._id}`);
              }}
            >
              ภาพรวม
            </li>
            <li
              onClick={() => {
                navigate(`/Note/${user._id}`);
              }}
            >
              จดบันทึก
            </li>
            <li className="active">เงินออม</li>
            <li>รายงาน</li>
          </ul>

          <button
            className="logout"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            ออกจากระบบ
          </button>
        </nav>

        {/* Main */}
        <main className="main">
          <header className="note-header">
            <h2>💰 เงินออม & เป้าหมาย</h2>
            <button className="btn-create"  onClick={() => setShowModal(true)}>
              + สร้างเป้าหมายใหม่
            </button>
          </header>

          {/* Blue Bar */}
          <div className="bar">
            <p className="bar-title">ยอดเงินออมรวมทั้งหมด</p>
            <h1 className="bar-amount">2,000</h1>
            <span className="bar-desc">
              เก็บเล็กผสมน้อย เพื่อความมั้นใจในอนาคต
            </span>
          </div>
        </main>
      </div>
      
    </section>
    {showModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>สร้างเป้าหมายใหม่</h3>

      <label>ชื่อเป้าหมาย</label>
      <input
        type="text"
        placeholder="เช่น ซื้อรถ, ไปเที่ยวทะเล"
      />

      <label>จำนวนเงินที่ต้องการ (บาท)</label>
      <input
        type="number"
        placeholder="0.00"
      />

      <div className="modal-actions">
        <button
          className="btn-cancel"
          onClick={() => setShowModal(false)}
        >
          ยกเลิก
        </button>

        <button className="btn-confirm">
          สร้าง
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
export default Page1;
