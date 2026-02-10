import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./Home.css";

function Report() {
  useAuthTimeout();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(
        `http://localhost:5000/api/incomereport/${id}?month=${month}&year=${year}`,
        {
          headers: { token },
        },
      )
      .then((res) => setIncomes(res.data));

    axios
      .get(
        `http://localhost:5000/api/expensereport/${id}?month=${month}&year=${year}`,
        {
          headers: { token },
        },
      )
      .then((res) => setExpenses(res.data));
  }, [month, year, id]);

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

  const exportPDF = () => {
    const element = document.getElementById("report-pdf");

    const opt = {
      margin: 10,
      filename: `รายงาน_${thaiMonths[month - 1]}_${year + 543}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

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
            <li
              onClick={() => {
                navigate(`/home/${user._id}`);
              }}
            >
              ภาพรวม
            </li>
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
          <button className="btn btn-primary mb-3" onClick={exportPDF}>
            บันทึกเป็น PDF
          </button>
          <div id="report-pdf" className="report-paper">
            <h2 className="text-center">รายงานสรุปบัญชี</h2>
            <p className="text-center">
              ประจำเดือน {thaiMonths[month - 1]} {year + 543}
            </p>

            {/* Financial Status */}
            {/* ตาราง summary */}
            {/* ตาราง statement */}
            <div className="d-flex gap-3 mb-4">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {thaiMonths.map((name, index) => (
                  <option key={index} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>รายการ</th>
                  <th>ประเภท</th>
                  <th>รับ</th>
                  <th>จ่าย</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((i) => (
                  <tr key={i._id}>
                    <td>{new Date(i.Income_Date).toLocaleDateString()}</td>
                    <td>{i.Income_Source}</td>
                    <td>รายรับ</td>
                    <td className="text-success">{i.Amount}</td>
                    <td>-</td>
                    <td>{i.Description}</td>
                  </tr>
                ))}

                {expenses.map((e) => (
                  <tr key={e._id}>
                    <td>{new Date(e.Expense_Date).toLocaleDateString()}</td>
                    <td>{e.Expense_Name}</td>
                    <td>รายจ่าย</td>
                    <td>-</td>
                    <td className="text-danger">{e.Amount}</td>
                    <td>{e.Description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Report;
