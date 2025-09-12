import { useNavigate, useParams } from "react-router-dom";
import classes from "./ReservationDetails.module.css";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "./PDF.css";
import InfoModal from "../components/InfoModal";
import ConfirmModal from "../components/ConfirmModal";


function ReservationDetails() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [object, setObject] = useState(null);
  const [objectOwner, setObjectOwner] = useState(null);
  const [client, setClient] = useState(null);
  const navigate = useNavigate();
  let totalDays = null;
  let cancelDeadline = null;
  let canRemoveDate = null;
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // fetch reservation
    fetch(`https://127.0.0.1:8000/reservations/${id}/`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setReservation(data);
        // fetch object
        return fetch(`https://127.0.0.1:8000/listings/${data.object}/`, {
          method: "GET",
          credentials: "include",
        });
      })
      .then(res => res.json())
      .then(data => {
        setObject(data);
        // fetch object owner
        return fetch(`https://127.0.0.1:8000/users/${data.owner}/`, {
          method: "GET",
          credentials: "include",
        });
      })
      .then(res => res.json())
      .then(data => {
        setObjectOwner(data);
      })
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (!reservation) return;
    fetch(`https://127.0.0.1:8000/users/${reservation.user}/`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setClient(data);
      })
  }, [reservation]);

  totalDays = Math.floor(new Date(reservation?.end_date)?.getTime() - new Date(reservation?.start_date)?.getTime() + 86400000) / 86400000;
  cancelDeadline = new Date(Math.floor(new Date(reservation?.start_date) - object?.reservation_edit_deadline * 86400000));
  canRemoveDate= new Date(Math.floor(new Date(reservation?.start_date).getTime() + (object?.reservation_edit_deadline + 1) * 86400000));

  const generatePDF = () => {
    const element = document.getElementById("reservationDetails");

    element.classList.add("PDFdetailsDiv");

    // Generate PDF
    html2pdf()
      .set({
        margin: 10,
        filename: "reservation.pdf",
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .output("bloburl")
      .then((pdfUrl) => window.open(pdfUrl, "_blank"))
      .finally(() => {
        element.classList.remove("PDFdetailsDiv");
      });
  };

  function handleDeleteReservation() {
    fetch(`https://127.0.0.1:8000/reservations/${id}/`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(res => {
        if (res.ok) {
          setMessage("Reservation succesfully deleted.");
        } else {
          setMessage("Failed to delete the reservaion.");
        }
        setConfirmModalOpen(false);
        setInfoModalOpen(true);
      })
      .catch(err => console.error(err));
  }

  return (
    <>    
      {new Date() <= Math.floor(new Date(reservation?.start_date)) ? 
        <>
          <button 
            className={new Date() <= cancelDeadline ? classes.cancelBtn : classes.cancelBtnInactive} 
            disabled={new Date() <= cancelDeadline ? false : true}
            onClick={() => {
              setConfirmModalOpen(true);
            }}
          >Cancel Reservation</button>
          <p className={classes.cancelText}>
            {new Date() <= cancelDeadline ? 
              `You can cancel this reservation not later as ${cancelDeadline.toLocaleDateString("pl-PL")}.` :
              `The cancel deadline is over. You can contact with the owner and personally discuss the situation.`
            }
          </p>
        </> : 
        <>
          <button 
            className={new Date() >= canRemoveDate ? classes.cancelBtn : classes.cancelBtnInactive} 
            disabled={new Date() >= canRemoveDate ? false : true}
            onClick={() => {
              setConfirmModalOpen(true);
            }}
          >Remove Reservation</button>
          <p className={classes.cancelText}>
            {new Date() >= canRemoveDate ? 
              `You can already delete this reservation. If you do so, the reservation will be deleted permanently for everyone (owner and client).` :
              `You can't delete this reservation yet. This option will be available from ${canRemoveDate.toLocaleDateString("pl-PL")}. Since this date, both owner and client will be able to delete this reservation permanently for everyone. If you want to save the reservation details, please press "Generate reservation details PDF" button and save the generated PDF file on your device.`
            }
          </p>
        </>
      }
      
      
      <div className={classes.detailsDiv} id="reservationDetails">
        <h1 className={classes.header}>Reservation Details</h1>
        <ul>
          <li>Reservation ID: {reservation?.id}</li>
          <li />
          <li><span><strong>OBJECT DETAILS</strong></span></li>
          <li>Object: {object?.name}</li>
          <li>Address: {object?.address}, {object?.town}</li>
          <li>Rooms: {object?.rooms}</li>
          <li>One day price: {object?.day_price_cents / 100} PLN</li>
          <li>Own kitchen: {object?.own_kitchen ? "yes" : "no"}</li>
          <li>Own bathroom: {object?.own_bathroom ? "yes" : "no"}</li>
          <li>Parking place: {object?.parking_place ? "yes" : "no"}</li>
          <li>Pets allowed: {object?.pets_allowed ? "yes" : "no"}</li>
          <li>Reservation cancel deadline: {object?.reservation_edit_deadline} days before start</li>
          <li>Check in hours: {object?.check_in_start_hour.slice(0, 5)} - {object?.check_in_end_hour.slice(0, 5)}</li>
          <li>Check out hours: {object?.check_out_start_hour.slice(0, 5)} - {object?.check_out_end_hour.slice(0, 5)}</li>
          <li />
          <li><span><strong>OBJECT OWNER</strong></span></li>
          <li>Name: {objectOwner?.first_name} {objectOwner?.last_name}</li>
          <li>Email address: {objectOwner?.email}</li>
          <li>Phone number: {objectOwner?.phone_number}</li>
          <li />
          <li><span><strong>CLIENT</strong></span></li>
          <li>Name: {client?.first_name} {client?.last_name}</li>
          <li>Email address: {client?.email}</li>
          <li>Phone number: {client?.phone_number}</li>
          <li />
          <li><span><strong>BOOKING DETAILS</strong></span></li>
          <li>From: {reservation?.start_date}</li>
          <li>To: {reservation?.end_date}</li>
          <li>Total days: {totalDays || ""}</li>
          <li>Total cost: {totalDays * object?.day_price_cents / 100 || 0} PLN</li>
        </ul>

        <p className={classes.paragraph}>Auto generated by VacationsPlace.com at {new Date().toLocaleString("pl-PL")}</p>
      </div>

      <button className={classes.pdfButton} onClick={generatePDF}>Generate reservation details PDF</button>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDeleteReservation}
        title={`Delete reservation`}
        message="Are you sure you want to delete this reservation for everyone? The decission is final and cannot be reversed."
      />

      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => {
          setInfoModalOpen(false);
          navigate("/profile/");
        }}
        title={`Object deletion`}
        message={message}
      />
    </>
  );
}

export default ReservationDetails;