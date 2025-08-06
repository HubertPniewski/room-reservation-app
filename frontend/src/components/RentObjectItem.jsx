import classes from './RentObjectItem.module.css';

function RentObjectItem({ object }) {
  return (
    <div className={classes.container}>
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
        <p>{object.town}</p>
        <p>Reviews</p>
      </div>
    </div>
  );
}

export default RentObjectItem;