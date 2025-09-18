import { Link } from "react-router-dom";
import classes from "./MyObjectItem.module.css";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import InfoModal from "./InfoModal";
import api from "../api";

function MyObjectItem({ object, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  // function handleConfirm() {
  //   fetch(`https://127.0.0.1:8000/listings/${object.id}/`, {
  //     method: "DELETE",
  //     credentials: "include",
  //   })
  //     .then(res => {
  //       if (res.ok) {
  //         setInfoMessage(`The ${object.name} was successfully deleted.`);
  //       } else {
  //         setInfoMessage(`Failed to delete ${object.name}. Try again later or contact with the administration.`);
  //       }
  //       setIsInfoModalOpen(true);
  //     })
  //     .catch(err => console.error(err));
  //   setIsModalOpen(false);
  // };
  function handleConfirm() {
    api.delete(`/listings/${object.id}/`)
      .then(() => {
        setInfoMessage(`The ${object.name} was successfully deleted.`);
        setIsInfoModalOpen(true);
      })
      .catch(err => {
        console.error(err);
        setInfoMessage(`Failed to delete ${object.name}. Try again later or contact with the administration.`);
        setIsInfoModalOpen(true);
      });
    setIsModalOpen(false);
  };

  return (
    <>
      <li className={classes.objectsList}>
        <p><Link to={`../listings/${object.id}/`}><span className={classes.green}>{object.name}</span></Link> ({object.rental_type}) | <span className={classes.green}>{object.day_price_cents/100} PLN/day</span> | {object.address}, {object.town}</p>
        <Link to={`../listings/${object.id}/edit/`}>
          <button className={classes.editButton}>Edit</button>
        </Link>
        <Link>
          <button className={classes.deleteButton} onClick={() => setIsModalOpen(true)}>Delete</button>
        </Link>
      </li>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={`Delete ${object.name}`}
        message="Are you sure you want to delete the object? The decission is final and cannot be reversed."
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => {
          setIsInfoModalOpen(false);
          onDelete();
        }}
        title={`Object deletion`}
        message={infoMessage}
      />
    </>
  );
}

export default MyObjectItem;