import { useEffect} from "react";
import { useState } from "react";
import {useParams } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Home.css";




function Report() {
  useAuthTimeout();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  

  const navigate = useNavigate();


  useEffect(() => {
     const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/id/${id}`, {
        headers: { token }
      })
      .then(res => setUser(res.data))
      .catch(err => console.log(err));



   if (!token) {
    window.location.href = "/login";
    return;
    }

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
        {/* Sidebar */}
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
            <li onClick={()=>{
              navigate(`/home/${user._id}`);
            }}
            >ภาพรวม</li>
            <li onClick={()=>{
              navigate(`/note/${user._id}`);
            }}>จดบันทึก</li>
            
            <li
            onClick={()=>{
              navigate(`/page1/${user._id}`);
            }}
            >เงินออม</li>
            <li className="active">รายงาน</li>
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
          <header>
            <h2>ภาพรวมการเงิน</h2>
            <p>สรุปรายรับรายจ่ายของคุณ</p>
          </header>

         
        
        </main>
      </div>
    </section>
  );
}

export default Report;

