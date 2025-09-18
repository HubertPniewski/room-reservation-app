import { Link } from "react-router-dom";
import classes from "./Errors.module.css";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className={classes.errorContainer}>
      <h1 className={classes.errorCode}>{error.status}</h1>
      <h2>Sorry, something went wrong</h2>
      <h3>Error: {error.statusText}</h3>
      <p>Details: {error.data}</p>
      <Link to="/">
        <button className={classes.homeButton}>Home</button>
      </Link>
    </div>
  );
}

export default ErrorPage;