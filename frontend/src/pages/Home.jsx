import { useEffect} from "react";
import { useState } from "react";
import {useParams } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Home.css";




function Home() {
  useAuthTimeout();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

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

  /*ดึง income เมื่อมี user แล้ว */
useEffect(() => {
  if (!user) return;

  axios
    .get(`http://localhost:5000/api/incomes/${user._id}`)
       .then(res => {
        console.log("income from api:", res.data); // ต้องเห็น 2 record

      const sum = res.data.reduce(
        (total, item) => total + Number(item.Amount),
        0
      );

      console.log("sum:", sum); // ต้องได้ 102.55
      setTotalIncome(sum);
    })
    .catch(err => console.log(err));
}, [user]);

  /*ดึง Expense เมื่อมี user แล้ว */
useEffect(() => {
  if (!user) return;

  axios
    .get(`http://localhost:5000/api/expense/${user._id}`)
       .then(res => {
        console.log("income from api:", res.data); // ต้องเห็น 2 record

      const sum = res.data.reduce(
        (total, item) => total + Number(item.Amount),
        0
      );

      console.log("sum:", sum); // ต้องได้ 102.55
      setTotalExpense(sum);
    })
    .catch(err => console.log(err));
}, [user]);


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

    const totalall = totalIncome - totalExpense


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
            <li className="active">ภาพรวม</li>
            <li onClick={()=>{
              navigate(`/note/${user._id}`);
            }}>จดบันทึก</li>
            
            <li
            onClick={()=>{
              navigate(`/page1/${user._id}`);
            }}
            >เงินออม</li>
            <li
            onClick={()=>{
              navigate(`/report/${user._id}`);
            }}
            >รายงาน</li>
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

          <section className="cards">
            <div className="card income">
              <p className="label">รายรับรวม</p>
              <p className="value">฿{totalIncome.toLocaleString()}</p>
              {/* <span className="up">+12.5% จากเดือนที่แล้ว</span> */}
            </div>

            <div className="card expense">
              <p className="label">รายจ่ายรวม</p>
              <p className="value">฿ {totalExpense.toLocaleString()}</p>
              {/* <span className="down">-8.3% จากเดือนที่แล้ว</span> */}
            </div>

            <div className="card balance">
              <p className="label">ยอดคงเหลือ</p>
              <p className="value big">฿ {totalall.toLocaleString()}</p>
              {/* <span>ประหยัดได้ 36.7% 🎉</span> */}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default Home;


      // <section className="home-content">
      //   <p>User ID: {id}</p>

      //   <div className="card" style={{ width: "18rem" }}>
      //     <div className="card-body">
      //       <h5 className="card-title">รายรับ</h5>
      //       <p className="card-text">รายรับ: {comein.toLocaleString()} บาท</p>
      //     </div>
      //   </div>       
      // </section>