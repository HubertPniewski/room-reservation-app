// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import MyObjectsList from "../components/MyObjectsList";
// import UserProfile from "../components/UserProfile";
// import classes from "./MyAccount.module.css";
// import MyReservations from "../components/MyReservations";
// import MyObjectsReservations from "../components/MyObjectsReservations";
// import api from "../api";

// function MyAccount() {
//   const [user, setUser] = useState(null);
//   const [objects, setObjects] = useState([]);
//   const [myReservations, setMyReservations] = useState([]);
//   const [myResObjects, setMyResObjects] = useState([]);
//   const [myObjectsReservations, setMyObjectsReservations] = useState([]);
//   const [myClients, setMyClients] = useState([]);

//   useEffect(() => {
//     fetch('https://127.0.0.1:8000/users/me/', {
//       method: "GET",
//       credentials: "include",
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Not authenticated");
//         return res.json();
//       })
//       .then(data => {
//         setUser(data);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   useEffect(() => {
//     fetch('https://127.0.0.1:8000/listings/my-objects/', {
//       method: "GET",
//       credentials: "include",
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Not authenticated");
//         return res.json();
//       })
//       .then(data => {
//         setObjects(data.results);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   // get data for my reservations
//   useEffect(() => {
//     fetch('https://127.0.0.1:8000/reservations/my-reservations/', {
//       method: "GET",
//       credentials: "include",
//     })
//       .then(res => res.json())
//       .then(data => {
//         setMyReservations(data);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   useEffect(() => {
//     if (!myReservations || myReservations.length === 0) return;

//     Promise.all(
//       // to improve, use batch fetching instead of single request for each reservation
//       myReservations.map(element =>
//         fetch(`https://127.0.0.1:8000/listings/${element.object}/`, {
//           method: "GET",
//           credentials: "include",
//         }).then(res => res.json())
//       )
//     )
//       .then(results => {
//         setMyResObjects(results);
//       })
//       .catch(err => console.error(err));
//   }, [myReservations]);

//   // get data for my objects reservations
//   useEffect(() => {
//     fetch('https://127.0.0.1:8000/reservations/my-clients/', {
//       method: "GET",
//       credentials: "include",
//     })
//       .then(res => res.json())
//       .then(data => {
//         setMyObjectsReservations(data);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   useEffect(() => {
//     if (!myObjectsReservations || myObjectsReservations.length === 0) return;

//     Promise.all(
//       // to improve, use batch fetching instead of single request for each reservation
//       myObjectsReservations.map(element =>
//         fetch(`https://127.0.0.1:8000/users/${element.user}/`, {
//           method: "GET",
//           credentials: "include",
//         }).then(res => res.json())
//       )
//     )
//       .then(results => {
//         setMyClients(results);
//       })
//       .catch(err => console.error(err));
//   }, [myObjectsReservations]);
  


//   return (
//     <>
//       {user ? <UserProfile data={user} /> : <p>Loading...</p>}
//       <div className={classes.editAccountDiv}>
//         <Link to="edit/">
//           <button className={classes.editAccountButton}>
//             Edit account data
//           </button>
//         </Link>        
//       </div>

//       <h3>Your reservations:</h3>
//       <MyReservations reservations={myReservations} objects={myResObjects} />

//       <h3>Your rental objects:</h3>
//       <div className={classes.rentalsBar}>
//         <div className={classes.rentalsBarInside}>
//           <h3>Object name (rental type) | price per day | address</h3>
//           <Link to="/listings/create/">
//             <button className={classes.addButton}>
//               Add +
//             </button>
//           </Link>
//         </div>
//       </div>
//       <MyObjectsList objects={objects} />

//       <h3>Reservations of your objects:</h3>
//       <MyObjectsReservations reservations={myObjectsReservations} objects={objects} clients={myClients} />
//     </>
//   );
// }

// export default MyAccount;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyObjectsList from "../components/MyObjectsList";
import UserProfile from "../components/UserProfile";
import classes from "./MyAccount.module.css";
import MyReservations from "../components/MyReservations";
import MyObjectsReservations from "../components/MyObjectsReservations";
import api from "../api";

function MyAccount() {
  const [user, setUser] = useState(null);
  const [objects, setObjects] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [myResObjects, setMyResObjects] = useState([]);
  const [myObjectsReservations, setMyObjectsReservations] = useState([]);
  const [myClients, setMyClients] = useState([]);

  // Get current user
  useEffect(() => {
    api.get("/users/me/")
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  // Get user's rental objects
  useEffect(() => {
    api.get("/listings/my-objects/")
      .then(res => setObjects(res.data.results))
      .catch(err => console.error(err));
  }, []);

  // Get user's reservations
  useEffect(() => {
    api.get("/reservations/my-reservations/")
      .then(res => setMyReservations(res.data))
      .catch(err => console.error(err));
  }, []);

  // Get objects for user's reservations
  useEffect(() => {
    if (!myReservations || myReservations.length === 0) return;

    Promise.all(
      myReservations.map(r => api.get(`/listings/${r.object}/`).then(res => res.data))
    )
    .then(results => setMyResObjects(results))
    .catch(err => console.error(err));
  }, [myReservations]);

  // Get reservations of user's objects
  useEffect(() => {
    api.get("/reservations/my-clients/")
      .then(res => setMyObjectsReservations(res.data))
      .catch(err => console.error(err));
  }, []);

  // Get clients for user's object reservations
  useEffect(() => {
    if (!myObjectsReservations || myObjectsReservations.length === 0) return;

    Promise.all(
      myObjectsReservations.map(r => api.get(`/users/${r.user}/`).then(res => res.data))
    )
    .then(results => setMyClients(results))
    .catch(err => console.error(err));
  }, [myObjectsReservations]);

  return (
    <>
      {user ? <UserProfile data={user} /> : <p>Loading...</p>}

      <div className={classes.editAccountDiv}>
        <Link to="edit/">
          <button className={classes.editAccountButton}>Edit account data</button>
        </Link>
      </div>

      <h3>Your reservations:</h3>
      <MyReservations reservations={myReservations} objects={myResObjects} />

      <h3>Your rental objects:</h3>
      <div className={classes.rentalsBar}>
        <div className={classes.rentalsBarInside}>
          <h3>Object name (rental type) | price per day | address</h3>
          <Link to="/listings/create/">
            <button className={classes.addButton}>Add +</button>
          </Link>
        </div>
      </div>
      <MyObjectsList objects={objects} />

      <h3>Reservations of your objects:</h3>
      <MyObjectsReservations
        reservations={myObjectsReservations}
        objects={objects}
        clients={myClients}
      />
    </>
  );
}

export default MyAccount;
