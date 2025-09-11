import React from "react";
import classes from "./Modal.module.css";


export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.message}>{message}</p>
        <div className={classes.buttonGroup}>
          <button className={classes.cancelButton} onClick={onClose}>Cancel</button>
          <button className={classes.confirmButton} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}