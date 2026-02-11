import axios from "axios";
import { useState } from "react";
import "./Register.css";

const baseURL = "http://localhost:5000/api/register";


function Register() {
  const [email,setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const createPost = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if((email == "")||(name =="")||(password==""))
        return alert("กรุณากรอกข้อมูลให้ครบ!!!");
      
      await axios.post(baseURL, { email,name,password});
      alert("Registration successful");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + "ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ");
    }
  };

  return (
    <section 
    className="vh-100 bg-image page-register"
  style={{ backgroundImage: "url('https://mdbcdn-bla-bla.webp')" }}>
  <div className="mask d-flex align-items-center h-100 gradient-custom-3">
    <div className="container h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
          <div style={{ borderRadius: "15px" }}>
            <div className="card-body p-5">
              <h2 className="text-uppercase text-center mb-5">Create an account</h2>

              <form >
                  <div data-mdb-input-init className="form-outline mb-4">
                  <input 
                  type="email" 
                  id="form3Example1cg" 
                  className="form-control form-control-lg" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="form-label" for="form3Example1cg">Your Email</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input 
                  type="text" 
                  id="form3Example1cg" 
                  className="form-control form-control-lg" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  />
                  <label className="form-label" for="form3Example1cg">Your Name</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input 
                  type="password" 
                  id="form3Example4cg" 
                  className="form-control form-control-lg" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <label className="form-label" for="form3Example4cg">Password</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input 
                  type="password" 
                  id="form3Example4cdg" 
                  className="form-control form-control-lg" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label className="form-label" for="form3Example4cdg">Repeat your password</label>
                </div>

              

                <div className="d-flex justify-content-center">
                  <button  type="button" onClick={createPost} data-mdb-button-init
                    data-mdb-ripple-init className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Register</button>
                </div>

                <p className="text-center text-muted mt-5 mb-0">Have already an account? <a href="/Login"
                    className="login-link fw-bold"><u>Login here</u></a></p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}

export default Register;
