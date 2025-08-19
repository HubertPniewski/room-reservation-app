import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoGallery from "../components/PhotoGallery";
import classes from "./RentObjectDetails.module.css";

function RentObjectDetails() {
  const { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    fetch(`https://127.0.0.1:8000/listings/${id}/`)
      .then(res => res.json())
      .then(data => {
        setObject(data);
      })
  }, [id]);

  if (!object) {
    return <p>Failed to load the object, please try again later.</p>;
  }

  return (
    <div className={classes.detailsContainer}>
      <h1 className={classes.objectName}>{object.name}</h1>
      <PhotoGallery photos={object.images} />
      <h2 className={classes.details}><span className={classes.detailColor}>Address:</span> {object.address}, {object.town}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Rental type:</span> {object.rental_type}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Price:</span> {object.day_price_cents/100} zł / day</h2>
      <h3 className={classes.desc}>Description:</h3>
      <p>{object.description}</p>
    </div>
  );
  
}

export default RentObjectDetails;