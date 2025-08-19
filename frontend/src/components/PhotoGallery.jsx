import { useState } from "react";
import classes from "./PhotoGallery.module.css";

function PhotoGallery({ photos }) {
  const [curImg, setCurImg] = useState(0);

  function prevImg() {
    if (photos[curImg - 1]) {
      setCurImg(curImg - 1);
    } else {
      setCurImg(photos.length - 1);
    }
  }

  function nextImg() {
    if (photos[curImg + 1]) {
      setCurImg(curImg + 1);
    } else {
      setCurImg(0);
    }
  }

  return (
    <div className={classes.galleryContainer}>
      <div className={classes.imgContainer}>
        <button className={classes.bigArrowButton} onClick={prevImg}>⟨</button>
        <img className={classes.bigImage} src={photos[curImg].image_url} alt={photos[curImg].image_url} />
        <button className={classes.bigArrowButton} onClick={nextImg}>⟩</button>
      </div>
      <div className={classes.photosContainer}>
        {photos && photos.map((photo, index) => (          
          <img className={classes.smallImage} key={photo.image_url} src={photo.image_url} alt={photo.image_url} onClick={() => {setCurImg(index)}} />
        ))}       
      </div>
    </div>
  );
}

export default PhotoGallery;