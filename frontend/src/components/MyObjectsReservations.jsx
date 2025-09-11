import { Link } from "react-router-dom";
import classes from "./MyReservations.module.css";

function findObject(object_id, objects) {
  let object;

  objects.forEach(obj => {
    if (obj.id == object_id) {
      object = obj;
    }
  });

  return object;
}

function MyObjectsReservations({ reservations, objects, clients }) {
  return (
    <div className={classes.reservationsContainer}>{
      reservations.map((res) => {
        const obj = findObject(res.object, objects);
        const client = findObject(res.user, clients)
        return (
          <div className={classes.reservation} key={res.id}>
            <img src={obj?.images[0]?.image_url} className={classes.resImage} />
            <div className={classes.resDetails}>
              <h3 className={classes.link}><Link to={`/listings/${obj?.id}/`}>{obj?.name}↗</Link></h3>
              <p>From: {res?.start_date}, To: {res?.end_date}</p>
              <p>Client: <Link to={`/users/${client?.id}/`}>{client?.first_name} {client?.last_name}↗</Link></p>
            </div>
            <Link to={`/reservations/${res.id}/`} className={classes.link}>
              <button>See details</button>
            </Link>  
          </div>
        );
      })}
      
    </div>
  );
}

export default MyObjectsReservations;