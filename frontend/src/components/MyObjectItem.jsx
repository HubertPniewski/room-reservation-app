import { Link } from "react-router-dom";
import classes from "./MyObjectItem.module.css";

function MyObjectItem({ object }) {
  return (
    <li className={classes.objectsList}>
      <p><span className={classes.green}>{object.name}</span> ({object.rental_type}) | <span className={classes.green}>{object.day_price_cents/100} PLN/day</span> | {object.address}, {object.town}</p>
      <Link>
        <button className={classes.editButton}>Edit</button>
      </Link>
      <Link>
        <button className={classes.deleteButton}>Delete</button>
      </Link>
    </li>
  );
}

export default MyObjectItem;