import { Link, useLocation } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>

  return (
    <div className={classes.background}>
      <h1>VacationsPlace</h1>
      <nav>
        <Link className={classes.button} to="/">Home</Link>
        {user ? (
          <>
            <Link className={classes.button} to="/profile">My account</Link>
            <Link className={classes.button} onClick={logout}>Logout</Link>
          </>
        ) : (
          <>
            <Link 
              className={classes.button} 
              to="/login"
              state={{ from: location }}
            >Login</Link>
            <Link className={classes.button} to="/register">Register</Link>
          </>
        )}
        
      </nav>
    </div>
  );
}

export default Navbar;