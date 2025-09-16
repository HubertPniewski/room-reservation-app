import { useEffect, useState } from "react";
import classes from "./Review.module.css";
import DOMPurify from 'dompurify';
import ConfirmModal from "./ConfirmModal.jsx";

function getStars(review) {
  if (!review) return "";
  let stars = "";
  for (let i=0; i<review.rating; i++) {
    stars = `${stars}★`;
  }
  for (let i=0; i<5-review.rating; i++) {
    stars = `${stars}☆`
  }
  return stars;
}

function formatText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>');            // *italic*
}



function ReviewForm({ review, author, object }) {
  const [newReview, setNewReview] = useState(!review);
  const [editMode, setEditMode] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [ratingSelection, setRatingSelection] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {    
    if (review) {
      setReviewText(review?.description);
      setRating(review?.rating);
      setRatingSelection(review?.rating);
    }   
    setNewReview(!review);
    if (review) setEditMode(false);
  }, [review]);

  async function handleButtonClick() {
    if (editMode) {
      console.log(object.id);
      const url = newReview ? `object/${object?.id}` : `${review?.id}`;
      const method = newReview ? "POST" : "PATCH";
      await fetch(`https://127.0.0.1:8000/reviews/${url}/`, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          rating: rating,
          description: reviewText,
          object: object.id
        }),
      })
        .catch(err => console.error(err));
        setEditMode(false);
        window.location.reload();
    } else {
      setEditMode(true);
    }     
  }

  async function handleDeleteReview() {
    await fetch(`https://127.0.0.1:8000/reviews/${review?.id}/`, {
      method: "DELETE",
      credentials: "include",
    })
      .catch(err => {
        alert("Failed to delete review.");
        console.error(err);
      });
      window.location.reload();
  }

  return (
    <>
      <div className={classes.reviewContainer}>
        <div className={classes.ownerContainer}>
          <img className={classes.avatar} src={author?.profile_image && author?.profile_image} />
          <h2 className={classes.userName}>{author?.first_name} {author?.last_name}</h2>
        </div>
        <p className={classes.ratingTimeRow}>
          {editMode ? 
            <span className={classes.stars} onMouseLeave={() => setRatingSelection(rating)} onClick={() => setRating(ratingSelection)}>
              <span className={classes.singleStar} onMouseOver={() => setRatingSelection(1)}>★</span>
              <span className={classes.singleStar} onMouseOver={() => setRatingSelection(2)}>{ratingSelection >= 2 ? "★" : "☆"}</span>
              <span className={classes.singleStar} onMouseOver={() => setRatingSelection(3)}>{ratingSelection >= 3 ? "★" : "☆"}</span>
              <span className={classes.singleStar} onMouseOver={() => setRatingSelection(4)}>{ratingSelection >= 4 ? "★" : "☆"}</span>
              <span className={classes.singleStar} onMouseOver={() => setRatingSelection(5)}>{ratingSelection >= 5 ? "★" : "☆"}</span>
            </span> :
            <span className={classes.stars}>{getStars(review)}</span>
          }
        {!newReview && `Last modified: ${new Date(review?.modified).toLocaleString("pl-PL")}`}</p>
        {editMode ? 
          <textarea 
            className={classes.textarea}
            value={reviewText || ""}
            placeholder="You can type your review here."
            onChange={e => setReviewText(e.target.value)}
          /> : 
          <p
            style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(formatText(review?.description)),
            }}
          ></p>
        }
        <div className={classes.buttonsContainer}>          
          {!newReview && <button onClick={() => setModalOpen(true)} className={classes.deleteButton}>Delete</button>}
          {!newReview && editMode && <button onClick={() => {setEditMode(false)}} className={classes.editButton}>Cancel</button>}
          <button onClick={handleButtonClick} className={classes.editButton}>{newReview ? "Post" : editMode ? "Save" : "Edit"}</button>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteReview}
        title={`Delete review`}
        message="Are you sure you want to delete the review? The decission is final and cannot be reversed."
      />
    </>
  );
}

export default ReviewForm;