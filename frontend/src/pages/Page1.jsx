
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
                >จดบันทึก</li>
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
              <div>
                <h2>บันทึกรายการ</h2>
                <p>บันทึกรายรับรายจ่ายของคุณ</p>
              </div>
            </header>
  
           
  
              
          </main>
        </div>
      </section>
    );
  }
export default Page1;
