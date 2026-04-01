import { Link, useNavigate } from "react-router-dom";
import { clearToken, isAuthed } from "../lib/auth";

export function Layout({ children }) {
  const navigate = useNavigate();
  const authed = isAuthed();

  function onLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">Interview Practice Analyzer</div>
        <div className="links">
          {authed ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/add">Add Problem</Link>
              <button className="btn danger" id="logoutbtn" onClick={onLogout} type="button">
                Logout
              </button>
            </>
          ) : ""}
        </div>
      </div>
      {children}
    </div>
  );
}

