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

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [addAmount, setAddAmount] = useState("");

  const [goals, setGoals] = useState([]);

  const totalAmount = goals.reduce(
    (sum, goal) => sum + Number(goal.InAmount),
    0,
  );
  const confirmAddMoney = async () => {
    if (!addAmount || Number(addAmount) <= 0) {
      alert("กรุณาใส่จำนวนเงินให้ถูกต้อง");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/savings/add/${selectedGoal._id}`,
        { amount: Number(addAmount) },
        { headers: { token } },
      );
      const now = new Date();
      await axios.post(
        `http://localhost:5000/api/expense`,
        {
          Expense_ID: user._id,
          Expense_Name: selectedGoal.Income_Source,
          Description: "ออมเงิน",
          Amount: Number(addAmount),
          Expense_Date: now,
        },
        { headers: { token } },
      );

      const res = await axios.get(
        `http://localhost:5000/api/savings/${user._id}`,
        { headers: { token } },
      );

      setGoals(res.data);

      setShowAddModal(false);
      setAddAmount("");
      setSelectedGoal(null);
    } catch (err) {
      console.log(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const createGoal = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!user) return;
      //  เช็คชื่อว่าง
      if (!goalName.trim()) {
        alert("กรุณากรอกชื่อเป้าหมาย");
        return;
      }
      //  เช็คจำนวนเงิน
      if (!targetAmount || Number(targetAmount) <= 0) {
        alert("กรุณากรอกจำนวนเงินให้ถูกต้อง");
        return;
      }

      if (
        goals.some(
          (goal) =>
            goal.Income_Source.trim().toLowerCase() ===
            goalName.trim().toLowerCase(),
        )
      ) {
        alert("ชื่อนี้ถูกใช้งานแล้ว");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/savings",
        {
          Income_ID: user._id,
          Income_Source: goalName,
          Amount: targetAmount,
        },
        { headers: { token } },
      );

      alert("สร้างเป้าหมายสำเร็จ");

      const res = await axios.get(
        `http://localhost:5000/api/savings/${user._id}`,
        { headers: { token } },
      );
      setGoals(res.data);

      setShowModal(false);
      setGoalName("");
      setTargetAmount("");
    } catch (err) {
      console.log(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

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

    axios
      .get(`http://localhost:5000/api/savings/${id}`, { headers: { token } })
      .then((res) => setGoals(res.data))
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
            <header className="note-header">
              <h2>💰 เงินออม & เป้าหมาย</h2>
              <button className="btn-create" onClick={() => setShowModal(true)}>
                + สร้างเป้าหมายใหม่
              </button>
            </header>

            {/* Blue Bar */}
            <div className="bar">
              <p className="bar-title">ยอดเงินออมรวมทั้งหมด</p>
              <h1 className="bar-amount">{totalAmount.toLocaleString()} บาท</h1>
              <span className="bar-desc">
                เก็บเล็กผสมน้อย เพื่อความมั้นใจในอนาคต
              </span>
            </div>
            <div className="goal-list">
              {goals.length === 0 ? (
                <p>ยังไม่มีเป้าหมาย</p>
              ) : (
                goals.map((goal) => {
                  const percent = Math.min(
                    (goal.InAmount / goal.Amount) * 100,
                    100,
                  );

                  return (
                    <div className="goal-card" key={goal._id}>
                      <h3>{goal.Income_Source}</h3>

                      <p>
                        เก็บแล้ว: {goal.InAmount.toLocaleString()} /
                        {goal.Amount.toLocaleString()} บาท
                      </p>
                      <p className="Date-p">
                        ล่าสุด: {new Date(goal.updatedAt).toLocaleString()}
                        <br />
                        วันที่สร้างเป้าหมาย:{" "}
                        {new Date(goal.createdAt).toLocaleString()}
                      </p>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <button
                        className="btn-add"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowAddModal(true);
                        }}
                      >
                        + เติมเงิน
                      </button>
                      <button
                        className="btn-delete"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              `ยืนยันการลบเป้าหมาย:${goal.Income_Source}?`,
                            )
                          )
                            return;

                          const token = localStorage.getItem("token");

                          await axios.delete(
                            `http://localhost:5000/api/savings/remove/${goal._id}`,
                            { headers: { token } },
                          );

                          setGoals(goals.filter((g) => g._id !== goal._id));
                        }}
                      >
                        - ลบ
                      </button>
                    </div>
                  );
                })
              )}
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
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />

            <label>จำนวนเงินที่ต้องการ (บาท)</label>
            <input
              type="number"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() =>
                  setShowModal(false) > setGoalName("") > setTargetAmount("")
                }
              >
                ยกเลิก
              </button>

              <button className="btn-confirm" onClick={createGoal}>
                สร้าง
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>เติมเงินเข้าเป้าหมาย</h3>

            <p>{selectedGoal?.Income_Source}</p>

            <label>จำนวนเงิน</label>
            <input
              type="number"
              placeholder="0.00"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowAddModal(false);
                  setAddAmount("");
                }}
              >
                ยกเลิก
              </button>

              <button className="btn-confirm" onClick={confirmAddMoney}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Page1;
