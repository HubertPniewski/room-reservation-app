import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PhotoGallery from "../components/PhotoGallery";
import Review from "../components/Review";
import ReviewForm from "../components/ReviewForm";
import classes from "./RentObjectDetails.module.css";
import defaultAvatar from "../assets/default_avatar.png";
import DOMPurify from 'dompurify';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function RentObjectDetails() {
  const { id } = useParams();
  const [object, setObject] = useState(null);
  const [objectOwner, setObjectOwner] = useState(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [reviewsAuthors, setReviewsAuthors] = useState([]);
  const [usersReview, setUsersReview] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(totalReviews / pageSize) || 1;


  function formatText(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
      .replace(/\*(.*?)\*/g, '<em>$1</em>');            // *italic*
  }

  function getAverageScore(reviews) {
    if (!reviews) return;

    let total = 0;
    let n_reviews = 0;

    reviews.forEach(e => {
      total += e.rating;
      n_reviews++;
    });

    return Math.round(total/n_reviews * 100) / 100;
  }


  useEffect(() => {
    fetch(`https://127.0.0.1:8000/listings/${id}/`)
      .then(res => res.json())
      .then(data => {
        setObject(data);
        if (!data?.owner) return null;
        return fetch(`https://127.0.0.1:8000/users/${data.owner}`);
      })
      .then(res => (res ? res.json() : null))
      .then(data => {
        if (data) {
          setObjectOwner(data);
        }
      })
      .catch(err => console.error(err));
  }, [id]);


  useEffect(() => {
    let isMounted = true;

    fetch(`https://127.0.0.1:8000/reviews/object/${id}/?page=${reviewsPage}`)
      .then(res => res.json())
      .then(async data => {
        if (!isMounted) return;

        const results = data.results || data;
        const count = data.count || results.length; 

        setReviews(results);
        setTotalReviews(count);

        if (!data || data.length === 0) return;

        const authors = await Promise.all(data.results.map(review => {
          return fetch(`https://127.0.0.1:8000/users/${review.author}/`)
            .then(res => res.json());
          } 
        ));

        if (isMounted) setReviewsAuthors(authors);
      })
      .catch(err => console.error(err));

    return () => { isMounted = false; };
  }, [id, reviewsPage]);

  useEffect(() => {
    if (!reviews || reviews.length <= 0) return;
    reviews.forEach(e => {
      if (e.author === user?.id) setUsersReview(e);
    });
  }, [reviews, user]);

  if (!object) {
    return <p>Failed to load the object, please try again later.</p>;
  }

  return (
    <div className={classes.detailsContainer}>
      <h1 className={classes.objectName}>{object.name}</h1>
      <PhotoGallery photos={object.images} />
      <h2 className={classes.details}><span className={classes.detailColor}>Address:</span> {object.address}, {object.town}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Rental type:</span> {object.rental_type}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Rooms:</span> {object.rooms}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Area:</span> {object.area} m²</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Price:</span> {object.day_price_cents/100} zł / day</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Check in hours:</span> {object.check_in_start_hour.substring(0,5)} - {object.check_in_end_hour.substring(0,5)}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Check out hours:</span> {object.check_out_start_hour.substring(0,5)} - {object.check_out_end_hour.substring(0,5)}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Advance booking required:</span> {object.advance_days} days before check in</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Reservation edit/cancel deadline:</span> {object.reservation_edit_deadline} days before check in</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Own kitchen:</span> {object.own_kitchen ? "✔" : "✘"}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Own bathroom:</span> {object.own_bathroom ? "✔" : "✘"}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Parking place:</span> {object.parking_place ? "✔" : "✘"}</h2>
      <h2 className={classes.details}><span className={classes.detailColor}>Pets allowed:</span> {object.pets_allowed ? "✔" : "✘"}</h2>
      <h3 className={classes.desc}>Description</h3>
      <p
        style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(formatText(object?.description)),
        }}
      ></p>
      {user ? 
        <Link to="reservation/">
          <button>Make a reservation</button>
        </Link> :
        <Link to="/login/" state={{ from: location }}>
          <button>Login to make a reservation</button>
        </Link>
      }
      
      {user && user.id === object.owner && (
        <Link to={`edit/`}>
          <button>Edit the rent object</button>
        </Link>
      )}
      
      <Link to={objectOwner?.id ? "/users/" + objectOwner.id : ""} className={classes.ownerLink}>
        <h3 className={classes.owner}>Owner</h3>
        {objectOwner ? 
          <div className={classes.ownerContainer}>
            <img className={classes.avatar} src={objectOwner.profile_image ? objectOwner.profile_image : defaultAvatar} />
            <h2 className={classes.userName}>{objectOwner.first_name} {objectOwner.last_name}</h2>
          </div> :
          <p>Loading...</p>
        }
      </Link>

      <h3 className={classes.desc}>{reviews && reviews.length > 0 ? `Reviews: ${getAverageScore(reviews)} on average from ${totalReviews} reviews` : "No reviews yet"}</h3>
      <div>
        {user ? <ReviewForm review={usersReview} author={user} object={object} /> : <Link to="/login/" state={{ from: location }}><p>Login to post or edit your review</p></Link>}
        {reviews && reviews.map(review => (
          ((user && review.author !== user.id) || !user ) && <Review key={review.id} review={review} author={reviewsAuthors && reviewsAuthors.find(author => author.id === review.author)}/>
        ))}
      </div>
      <div className={classes.pagesContainer}>
        <button 
          className={classes.pageButton} 
          onClick={() => {
            if (reviewsPage > 1) {
              setReviewsPage(prev => prev - 1);
            }
          }}
          disabled={reviewsPage <= 1}
        >{"<"}</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            className={classes.pageButton}
            key={i}
            disabled={reviewsPage === i + 1}
            onClick={() => setReviewsPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button 
          className={classes.pageButton} 
          onClick={() => {
            if (reviewsPage < totalPages) {
              setReviewsPage(prev => prev + 1);
            }
          }}
          disabled={reviewsPage >= totalPages}
        >{">"}</button>
      </div>
    </div>
  );
  
}

export default RentObjectDetails;