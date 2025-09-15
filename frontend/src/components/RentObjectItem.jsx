import { Link } from 'react-router-dom';
import classes from './RentObjectItem.module.css';

function RentObjectItem({ object }) {
  return (
    <Link to={"/listings/" + object.id} className={classes.container}>
      <h2 className={classes.header}>{object.name}</h2>

      <div className={classes.imageWrapper}>
        {object.images.length > 0 ? (
          <img src={object.images[0].image_url} alt="Failed to load the image." />
        ) : (
          <p>No image available</p>
        )}
      </div>
      
      <div className={classes.footer}>
        <p><span className={classes.price}>{(object.day_price_cents)/100} PLN</span> / day</p>
        <p>{object.rental_type}, {object.rooms} {object.rooms == 1 ? "room" : "rooms"}, {object.town}</p>
        <div className={classes.starsContainer}>
          <div className={classes.starsWrapper}>
            <div className={classes.starsBackground}>☆☆☆☆☆</div>
            <div
              className={classes.starsForeground}
              style={{ width: `${(object?.average_rating / 5) * 100}%` }}
            >
              ★★★★★
            </div>
          </div>
          <span className={classes.reviewsCount}>({object?.reviews_count})</span>
        </div>
      </div>
    </Link>
  );
}

export default RentObjectItem;