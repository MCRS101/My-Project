import { useEffect } from "react";

function Page1() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <section>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link" aria-current="page" href="/home">
            Home
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/pages1">
            Page1
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">
            Link
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">
            Disabled
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Page1;
