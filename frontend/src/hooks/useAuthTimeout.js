import { useEffect } from "react";

export default function useAuthTimeout() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExp = localStorage.getItem("token_exp");

    if (!token || !tokenExp) {
      window.location.href = "/login";
      return;
    }

    const timer = setInterval(() => {
      const exp = Number(localStorage.getItem("token_exp"));
      const now = Date.now();
      const remainMs = exp - now;

      if (remainMs <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_exp");
        alert("หมดเวลาใช้งาน กรุณาเข้าสู่ระบบใหม่");
        window.location.href = "/login";
      } else {
        const sec = Math.floor(remainMs / 1000);
        console.log(`⏳ เหลือเวลา ${Math.floor(sec / 60)} นาที ${sec % 60} วินาที`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
}
