import { Link } from "react-router-dom";
import classes from "./Errors.module.css";

function NotFound() {
  document.title = "404 Not found";
  return (
    <div className={classes.errorContainer}>
      <h1 className={classes.errorCode}>404</h1>
      <h2>Sorry, the page was not found</h2>
      <p>If you think this page should exist, please make sure the url is correct.</p>
      <Link to="/">
        <button className={classes.homeButton}>Home</button>
      </Link>
    </div>
  );
}

export default NotFound;