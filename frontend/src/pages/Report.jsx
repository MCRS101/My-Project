import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "./Home.css";
import "./Report.css";

function Report() {
  useAuthTimeout();
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear()); // ค.ศ.
  const [day, setDay] = useState(new Date().getDate());

  const [mode, setMode] = useState("month"); // "day" | "month" | "year"
  const [typeFilter, setTypeFilter] = useState("all"); // all | income | expense

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [isExporting, setIsExporting] = useState(false); // ✅ เพิ่มไว้ใช้ตอนทำ PDF

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

  const toBE = (y) => y + 543; // แสดง พ.ศ.

  const typeLabel =
    typeFilter === "all"
      ? "ทั้งหมด"
      : typeFilter === "income"
        ? "รายรับ"
        : "รายจ่าย";

  // โหลด user
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

  // โหลดรายรับ/รายจ่ายตามโหมด (วัน/เดือน/ปี)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
    });

    if (mode === "day") params.set("day", String(day));
    if (mode === "year") params.delete("month");

    axios
      .get(
        `http://localhost:5000/api/incomereport/${id}?${params.toString()}`,
        {
          headers: { token },
        },
      )
      .then((res) => setIncomes(res.data))
      .catch((err) => console.log(err));

    axios
      .get(
        `http://localhost:5000/api/expensereport/${id}?${params.toString()}`,
        {
          headers: { token },
        },
      )
      .then((res) => setExpenses(res.data))
      .catch((err) => console.log(err));
  }, [mode, day, month, year, id]);

  // loading
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

  // วันที่เป็นไทย
  const formatThaiDate = (date) =>
    new Date(date).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const statementRows = [
    ...incomes.map((i) => ({
      _id: i._id,
      date: i.Income_Date,
      title: i.Income_Source,
      type: "income",
      income: i.Amount,
      expense: null,
      desc: i.Description,
    })),
    ...expenses.map((e) => ({
      _id: e._id,
      date: e.Expense_Date,
      title: e.Expense_Name,
      type: "expense",
      income: null,
      expense: e.Amount,
      desc: e.Description,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const filteredRows =
    typeFilter === "all"
      ? statementRows
      : statementRows.filter((r) => r.type === typeFilter);

  // export pdf (✅ ทำให้ตอน export เปลี่ยน layout ได้)
  const exportPDF = () => {
    const element = document.getElementById("report-pdf");

    setIsExporting(true);

    const opt = {
      margin: 10,
      filename: `รายงาน_${thaiMonths[month - 1]}_${toBE(year)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setIsExporting(false))
      .catch(() => setIsExporting(false));
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
            <li onClick={() => navigate(`/home/${user._id}`)}>ภาพรวม</li>
            <li onClick={() => navigate(`/note/${user._id}`)}>จดบันทึก</li>
            <li onClick={() => navigate(`/page1/${user._id}`)}>เงินออม</li>
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

          <div
            id="report-pdf"
            className={`report-paper ${isExporting ? "exporting" : ""}`}
          >
            <h2 className="text-center">รายงานสรุปบัญชี</h2>

            {/* ✅ แถวสรุปสำหรับ PDF เท่านั้น */}
            {isExporting && (
              <div className="pdf-filterline">
                <div className="pdf-row">
                  <span>📅 วัน : {day}</span>
                  <span>เดือน : {thaiMonths[month - 1]}</ span>
                  <span>ปี : {year + 543}</span>
                </div>

                <div className="pdf-row">
                  <span>
                    📂 ประเภท :{" "}
                    {typeFilter === "all"
                      ? "ทั้งหมด"
                      : typeFilter === "income"
                        ? "รายรับ"
                        : "รายจ่าย"}
                  </span>
                </div>
              </div>
            )}

            {/* ✅ Controls: ให้แสดงเฉพาะบนเว็บ (ซ่อนตอน PDF) */}
            {!isExporting && (
              <div className="report-controls">
                <div className="date-box">
                  <div className="mode-tabs">
                    <button
                      className={mode === "day" ? "tab active" : "tab"}
                      onClick={() => setMode("day")}
                      type="button"
                    >
                      วัน
                    </button>
                    <button
                      className={mode === "month" ? "tab active" : "tab"}
                      onClick={() => setMode("month")}
                      type="button"
                    >
                      เดือน
                    </button>
                    <button
                      className={mode === "year" ? "tab active" : "tab"}
                      onClick={() => setMode("year")}
                      type="button"
                    >
                      ปี
                    </button>
                  </div>

                  <div className="date-inputs">
                    {mode === "day" && (
                      <div className="field">
                        <label>วัน</label>
                        <select
                          value={day}
                          onChange={(e) => setDay(Number(e.target.value))}
                        >
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    )}

                    {(mode === "day" || mode === "month") && (
                      <div className="field">
                        <label>เดือน</label>
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
                      </div>
                    )}

                    <div className="field">
                      <label>ปี</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      >
                        {[2024, 2025, 2026, 2027].map((y) => (
                          <option key={y} value={y}>
                            {toBE(y)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ✅ เปลี่ยน "แสดง" -> "ประเภท" */}
                <div className="type-box">
                  <label>ประเภท</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="income">รายรับ</option>
                    <option value="expense">รายจ่าย</option>
                  </select>
                </div>
              </div>
            )}

            {/* Table */}
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
                {filteredRows.map((r) => (
                  <tr key={r._id}>
                    <td>{formatThaiDate(r.date)}</td>
                    <td>{r.title}</td>
                    <td>{r.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
                    <td className="text-success">{r.income ?? "-"}</td>
                    <td className="text-danger">{r.expense ?? "-"}</td>
                    <td>{r.desc || "-"}</td>
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
