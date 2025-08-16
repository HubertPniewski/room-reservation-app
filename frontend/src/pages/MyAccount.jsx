import { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import classes from "./MyAccount.module.css";
import MyObjectsList from "../components/MyObjectsList";
import { Link } from "react-router-dom";

function MyAccount() {
  const [user, setUser] = useState(null);
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    fetch('https://127.0.0.1:8000/users/me/', {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('https://127.0.0.1:8000/listings/my-objects/', {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        setObjects(data.results);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h2>Your account</h2>
      {user ? <UserProfile data={user} /> : <p>Loading...</p>}
      <div className={classes.editAccountDiv}>
        <Link>
          <button className={classes.editAccountButton}>
            Edit account data
          </button>
        </Link>        
      </div>
      <div className={classes.rentalsBar}>
        <div className={classes.rentalsBarInside}>
          <h3>Your rental objects:</h3>
          <Link>
            <button className={classes.addButton}>
              Add +
            </button>
          </Link>
        </div>
      </div>
      <MyObjectsList objects={objects} />
    </>
  );
}

export default MyAccount;