import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { useRef } from "react";

import "./Home.css";

function Home() {
  useAuthTimeout();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  const chartRef = useRef(null);
  const chartLine = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/id/${id}`, {
        headers: { token },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));

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
      .then((res) => {
        console.log("income from api:", res.data); // ต้องเห็น 2 record
        setIncomeList(res.data); // เก็บข้อมูลดิบไว้

        const sum = res.data.reduce(
          (total, item) => total + Number(item.Amount),
          0,
        );

        console.log("sum:", sum); // ต้องได้ 102.55
        setTotalIncome(sum);
      })
      .catch((err) => console.log(err));
  }, [user]);

  /*ดึง Expense เมื่อมี user แล้ว */
  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/expense/${user._id}`)
      .then((res) => {
        console.log("income from api:", res.data); // ต้องเห็น 2 record
        setExpenseList(res.data); // เก็บข้อมูลดิบไว้

        const sum = res.data.reduce(
          (total, item) => total + Number(item.Amount),
          0,
        );

        console.log("sum:", sum); // ต้องได้ 102.55
        setTotalExpense(sum);
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (!chartRef.current) return;

    const hasData = totalIncome > 0 || totalExpense > 0;

    const chart = new Chart(chartRef.current, {
      type: "pie",
      data: {
        labels: hasData ? ["รายรับ", "รายจ่าย"] : ["ยังไม่มีข้อมูล"],
        datasets: [
          {
            data: hasData ? [totalIncome, totalExpense] : [1], // ใส่ 1 เพื่อให้มีวงกลมขึ้นมา
            backgroundColor: hasData ? ["#28a745", "#dc3545"] : ["#cccccc"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });

    return () => chart.destroy();
  }, [totalIncome, totalExpense]);

useEffect(() => {
  if (!chartLine.current) return;
  if (!incomeList.length && !expenseList.length) return;

  const categoryMap = {};

  // 🔵 รวมรายรับตาม Income_Source
  incomeList.forEach((item) => {
    const category = item.Income_Source || "อื่น ๆ";

    if (!categoryMap[category]) {
      categoryMap[category] = { income: 0, expense: 0 };
    }

    categoryMap[category].income += Number(item.Amount);
  });

  // 🔴 รวมรายจ่าย (แก้ชื่อ field ให้ตรงของคุณ)
  expenseList.forEach((item) => {
    const category = item.Expense_Name || "อื่น ๆ";

    if (!categoryMap[category]) {
      categoryMap[category] = { income: 0, expense: 0 };
    }

    categoryMap[category].expense += Number(item.Amount);
  });

  const labels = Object.keys(categoryMap);

  const incomeValues = labels.map(
    (category) => categoryMap[category].income
  );

  const expenseValues = labels.map(
    (category) => categoryMap[category].expense
  );

  const chart = new Chart(chartLine.current, {
    type: "line", // 🔥 bar เหมาะกับ category มากกว่า line
    data: {
      labels,
      datasets: [
        {
          label: "รายรับ",
          data: incomeValues,
          backgroundColor: "#28a745",
        },
        {
          label: "รายจ่าย",
          data: expenseValues,
          backgroundColor: "#dc3545",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  return () => chart.destroy();
}, [incomeList, expenseList]);



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

  const totalall = totalIncome - totalExpense;

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
            <li
              onClick={() => {
                navigate(`/note/${user._id}`);
              }}
            >
              จดบันทึก
            </li>

            <li
              onClick={() => {
                navigate(`/page1/${user._id}`);
              }}
            >
              เงินออม
            </li>
            <li
              onClick={() => {
                navigate(`/report/${user._id}`);
              }}
            >
              รายงาน
            </li>
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

            <div class="chart-container">
              <div class="card">
                <div class="card-body">
                  {totalIncome === 0 && totalExpense === 0 ? (
                    <p className="text-center mt-3">ยังไม่มีข้อมูลการเงิน</p>
                  ) : (
                    <canvas ref={chartRef}></canvas>
                  )}
                </div>
              </div>
            </div>

            <div className="chart-container1">
              <div className="card">
                <div className="card-body">
                  {totalIncome === 0 && totalExpense === 0 ? (
                    <p className="text-center mt-3">ยังไม่มีข้อมูลการเงิน</p>
                  ) : (
                    <canvas ref={chartLine}></canvas>
                  )}
                </div>
              </div>
            </div>

             <div class="chart-container">
              <div class="card">
                <div class="card-body">
                  
                    <p className="text-center mt-3">@Ads</p>
                  
           
                </div>
              </div>
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
