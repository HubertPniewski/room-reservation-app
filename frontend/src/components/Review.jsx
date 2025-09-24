import classes from "./Review.module.css";
import defaultAvatar from "../assets/default_avatar.png";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";

function formatText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>');            // *italic*
}

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


function Review({ review, author }) {
  return (
    <div className={classes.reviewContainer}>
      <Link to={`/users/${author?.id}/`}>
        <div className={classes.ownerContainer}>
          <img className={classes.avatar} src={author?.profile_image ? author.profile_image : defaultAvatar} />
          <h2 className={classes.userName}>{author?.first_name} {author?.last_name}</h2>
        </div>
      </Link>
      <p className={classes.ratingTimeRow}><span className={classes.stars}>{getStars(review)}</span>Last modified: {new Date(review?.modified).toLocaleString("pl-PL")}</p>
      <p
        style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(formatText(review?.description)),
        }}
      ></p>
    </div>
  );
}

export default Review;