import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";

function Navbar() {
  return (
    <div className={classes.background}>
      <h1>VacationsPlace</h1>
      <nav>
        <Link className={classes.button} to="/">Home</Link>
        <Link className={classes.button} to="/login">Login</Link>
        <Link className={classes.button} to="/login">Register</Link>
      </nav>
    </div>
  );
}

export default Navbar;