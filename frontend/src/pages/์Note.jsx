import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthTimeout from "../hooks/useAuthTimeout";
import axios from "axios";
import "./Note.css";

function Note() {
  useAuthTimeout();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ====== form states ======
  const [type, setType] = useState("expense"); // "income" | "expense"
  const [date, setDate] = useState(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // input type="date" ใช้ format นี้
  });

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [needChecked, setNeedChecked] = useState(true); // รายจ่ายจำเป็น
  const [variableChecked, setVariableChecked] = useState(false); // รายจ่ายผันแปร

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

  // ตัวอย่างหมวดหมู่ (แก้/ดึงจาก API ได้ทีหลัง)
  const expenseCategories = [
    "อาหาร/เครื่องดื่ม",
    "เดินทาง",
    "ของใช้ส่วนตัว",
    "บิล/ค่าน้ำไฟ",
    "สุขภาพ",
    "อื่นๆ",
  ];
  const incomeCategories = ["เงินเดือน", "รายได้เสริม", "โบนัส", "อื่นๆ"];

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const onSubmit = () => {
    // TODO: ตรงนี้ค่อยเอาไปยิง API บันทึกจริง
    // แนะนำให้ validate ก่อนส่ง
    if (!category) return alert("กรุณาเลือกหมวดหมู่หลัก");
    if (!amount || Number(amount) <= 0)
      return alert("กรุณากรอกจำนวนเงินให้ถูกต้อง");

    const payload = {
      userId: user._id,
      type,
      date,
      category,
      amount: Number(amount),
      note,
      tags: {
        need: needChecked,
        variable: variableChecked,
      },
    };

    console.log("SAVE NOTE:", payload);
    alert("บันทึกสำเร็จ (ตัวอย่าง) — ดู payload ใน console ได้เลย");
  };

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
            <li className="active">จดบันทึก</li>

            <li
            onClick={() => {
                navigate(`/page1/${user._id}`);
              }}
              >เงินออม</li>

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

          <section className="note-page">
            <div className="note-card">
              {/* ประเภทรายการ + วันที่ */}
              <div className="note-row two-col">
                <div>
                  <label className="note-label">ประเภทรายการ</label>
                  <div className="toggle-group">
                    <button
                      type="button"
                      className={`toggle-btn ${type === "income" ? "active income" : ""}`}
                      onClick={() => setType("income")}
                    >
                      + รายรับ
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${type === "expense" ? "active expense" : ""}`}
                      onClick={() => setType("expense")}
                    >
                      - รายจ่าย
                    </button>
                  </div>
                </div>

                <div>
                  <label className="note-label">วันที่</label>
                  <div className="date-input-wrap">
                    <input
                      className="note-input"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* หมวดหมู่ */}
              <div className="note-row">
                <label className="note-label">หมวดหมู่หลัก</label>
                <select
                  className="note-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* จำนวนเงิน */}
              <div className="note-row">
                <label className="note-label">จำนวนเงิน (บาท)</label>
                <input
                  className="note-input amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* บันทึกช่วยจำ */}
              <div className="note-row">
                <label className="note-label">บันทึกช่วยจำ (Note)</label>
                <textarea
                  className="note-input textarea"
                  placeholder="เช่น เลี้ยงข้าวสาว"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Needs vs Wants / Fixed vs Variable */}
              <div className="note-row two-col">
                <button
                  type="button"
                  className={`choice-card ${needChecked ? "checked green" : ""}`}
                  onClick={() => setNeedChecked((v) => !v)}
                >
                  <div className="choice-left">
                    <span className={`checkbox ${needChecked ? "on" : ""}`} />
                    <div>
                      <div className="choice-title">รายจ่ายจำเป็น</div>
                      <div className="choice-sub">Needs vs Wants</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`choice-card ${variableChecked ? "checked pink" : ""}`}
                  onClick={() => setVariableChecked((v) => !v)}
                >
                  <div className="choice-left">
                    <span
                      className={`checkbox ${variableChecked ? "on" : ""}`}
                    />
                    <div>
                      <div className="choice-title pink-text">
                        รายจ่ายผันแปร
                      </div>
                      <div className="choice-sub">Fixed vs Variable</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* ปุ่มยืนยัน */}
              <button className="confirm-btn" type="button" onClick={onSubmit}>
                ยืนยันการบันทึก
              </button>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default Note;
