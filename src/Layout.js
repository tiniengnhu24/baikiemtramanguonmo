import "./assets/css/layout.css";
import logo from "./assets/images/Ten-truong-do-1000x159.png";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <html>
      <header>
        <link rel="stylesheet" href="assets/css/layout.css" />

        <div id="header" className="header">
          {/* --- Banner (Logo + Thanh menu trên cùng) --- */}
          <div id="banner" className="banner">
            <div id="divmenutrai">
              <nav id="menutrai">
                <ul className="menutrai" style={{ width: "250px" }}>
                  <li>
                    <a href="/" className="menutrai">
                      TRANG CHU
                    </a>
                  </li>
                  <li>
                    <a className="menutrai" href="/trang1">
                      EGOV
                    </a>
                  </li>
                  <li>
                    <a className="menutrai" href="/admin/products">
                      QUAN TRI
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div style={{ width: "1000px" }}>
              <a href="/">
                <img src={logo} width="500" height="80" alt="logo" />
              </a>
            </div>
          </div>

          {/* --- Thanh menubar phía dưới (đỏ) --- */}
          <div id="menubar" className="menubar">
            <div className="menubar-left">
              <a href="/menu1" className="menu-item">
                Menu 1
              </a>
              <a href="/menu2" className="menu-item">
                Menu 2
              </a>
              <a href="/menu3" className="menu-item">
                Menu 3
              </a>
            </div>

            <div className="menubar-right">
              {user ? (
                <>
                  <span className="username">👤 {user.username}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <a href="/login" className="login-link">
                  Đăng nhập
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <body>
        <Outlet />
      </body>

      <footer></footer>
    </html>
  );
};

export default Layout;
