import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", {
        name,
        password,
      });

      localStorage.setItem("token", res.data.token);
          // ✅ ตั้งเวลาหมดอายุ (1 ชั่วโมง)
    localStorage.setItem(
      "token_exp",
      Date.now() + 60 * 60 * 1000
    );
       
      const userId = res.data.payload.USER.id;
      navigate(`/home/${userId}`);

    } catch (err) {
        console.log(err);
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

    return (
        
    <section className="login-page vh-100">
      <div className="container-fluid">
        <div className="row">
          {/* LEFT */}
          <div className="col-sm-6 text-black">
            <div className="px-5 ms-xl-4 pt-5">
               
              <i
                className="bi bi-credit-card-fill fa-2x me-3 pt-5 mt-xl-4"
                style={{ color: "#709085" }}
              ></i>
              <span className="h1 fw-bold mb-0">ระบบออมเงินรายรับรายจ่าย</span>
            </div>

            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5 ">
              <form style={{ width: "23rem" }} onSubmit={handleLogin}>
                <h2
                  className="fw-normal mb-3 pb-3 "
                  style={{ letterSpacing: "0.1px", fontSize: "35px", fontWeight: 800 }}
                >
                  Login
                </h2>

                {/* Username */}
                <div className="form-outline mb-4">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-lg "
                    value={name}
                     autoComplete="current-name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <small className="text-muted">
                    กรุณาใส่ Username ของท่าน
                  </small>
                </div>

                {/* Password */}
                <div className="form-outline mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  
                  <small className="text-muted">
                    กรุณาใส่ Password ของท่าน
                  </small>
                </div>

                <div className="pt-1 mb-4">
                  <button
                    type="submit"
                    className="btn btn-login btn-lg btn-block"
                  >
                    Login
                  </button>
                </div>

                <p>
                  Don't have an account?{" "}
                  <a href="/register" className="link-Register">
                    Register here
                  </a>
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img
              src="https://cdn.fbsbx.com/v/t59.2708-21/271330525_458020032709880_580465020263411084_n.gif?_nc_cat=103&ccb=1-7&_nc_sid=cf94fc&_nc_eui2=AeGriuj62tvjrQjSRpKOMPQH2QNguzxrC8vZA2C7PGsLy7MjDArEc3rXtBHU57-x9gCWVZPU8PF4ucjLV3i_hPH1&_nc_ohc=f-BEYJarC5gQ7kNvwF1bj-2&_nc_oc=AdmEM8XiT-2uXvujqut2r9ndgcV25Ls8ZLQbutHVmckpFmbprGW_hpCUQP9_3DR0s31LwKIlNvIoIHCHYVkXqq-v&_nc_zt=7&_nc_ht=cdn.fbsbx.com&_nc_gid=NbCz5ytazHrn8MOi3dNFgA&oh=03_Q7cD4gGjb_9bXHjvQZjuegJK-k7B8ou6E-wzSWAGK925v2AlKA&oe=698D07BA"
              alt="Login"
              className="w-100 vh-100"
              style={{ objectFit: "cover", objectPosition: "left" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
