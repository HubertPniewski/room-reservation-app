import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyObjectsList from "../components/MyObjectsList";
import UserProfile from "../components/UserProfile";
import classes from "./MyAccount.module.css";
import MyReservations from "../components/MyReservations";

function MyAccount() {
  const [user, setUser] = useState(null);
  const [objects, setObjects] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [myResObjects, setMyResObjects] = useState([]);

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

  useState(() => {
    fetch('https://127.0.0.1:8000/reservations/my-reservations/', {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setMyReservations(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!myReservations || myReservations.length === 0) return;

    Promise.all(
      myReservations.map(element =>
        fetch(`https://127.0.0.1:8000/listings/${element.object}/`, {
          method: "GET",
          credentials: "include",
        }).then(res => res.json())
      )
    )
      .then(results => {
        setMyResObjects(results);
      })
      .catch(err => console.error(err));
  }, [myReservations]);


  return (
    <>
      {user ? <UserProfile data={user} /> : <p>Loading...</p>}
      <div className={classes.editAccountDiv}>
        <Link to="edit/">
          <button className={classes.editAccountButton}>
            Edit account data
          </button>
        </Link>        
      </div>

      <h2>Your reservations:</h2>
      <MyReservations reservations={myReservations} objects={myResObjects} />

      <div className={classes.rentalsBar}>
        <div className={classes.rentalsBarInside}>
          <h3>Your rental objects:</h3>
          <Link to="/listings/create/">
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