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

function MyReservations({ reservations, objects }) {
  return (
    <div className={classes.reservationsContainer}>{
      reservations.map((res) => {
        const obj = findObject(res.object, objects);
        return (
          <div className={classes.reservation} key={res.id}>
            <img src={obj?.images[0]?.image_url} className={classes.resImage} />
            <div className={classes.resDetails}>
              <h3>{obj?.name}</h3>
              <p>From: {res?.start_date}, To: {res?.end_date}</p>
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

export default MyReservations;