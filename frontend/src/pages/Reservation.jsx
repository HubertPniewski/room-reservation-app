import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pl";
import classes from "./Reservation.module.css";
import { Link, useParams } from 'react-router-dom';

moment.updateLocale("pl-PL", {
  week: {
    dow: 1, 
  },
});

const localizer = momentLocalizer(moment);

function Reservation() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState(null); // null / start / end
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [events, setEvents] = useState([]);
  const [previewEvent, setPreviewEvent] = useState(null);
  const { id } = useParams();
  const [object, setObject] = useState(null);
  const [objectOwner, setObjectOwner] = useState(null);

  const handleSlotClick = ({ start }) => {
    if (mode === "start") {
      setSelectedStart(start);
      setSelectedEnd(null);
      setMode("end");
    } else if (mode === "end") {
      setSelectedEnd(start);
      setMode(null);
    }
  };

  useEffect(() => {
    if (selectedStart && selectedEnd) {
      if (selectedEnd < selectedStart) {
        alert("End must be after start!")
        setSelectedEnd(null);
        setPreviewEvent(null);
        return;
      }

      const inclusiveEnd = new Date(selectedEnd.getTime() + 24 * 60 * 60 * 1000);

      setPreviewEvent({
        title: "Selected",
        start: selectedStart,
        end: inclusiveEnd,
        allDay: true,
        isPreview: true,
      });
    }
  }, [selectedStart, selectedEnd]);

  useEffect(() => {
    fetch(`https://127.0.0.1:8000/listings/${id}/`)
      .then(res => res.json())
      .then(data => {
        setObject(data);
        return data;
      })
      .then(data => fetch(`https://127.0.0.1:8000/users/${data.owner}/`))
      .then(res => res.json())
      .then(data => {
        setObjectOwner(data);
      })
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`https://127.0.0.1:8000/reservations/object/${id}/`)
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.map(event => ({
          title: "Reserved",
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: true,
        }));
        setEvents(formattedEvents);
      })
      .catch(err => console.error(err));
  }, [id]);

  function getEventLength(event) {
    if (!event?.start || !event?.end) return 0;

    const start = new Date(event.start);
    start.setHours(0, 0, 0, 0);

    const end = new Date(event.end);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - start;
    return Math.floor(diffTime / (1000 * 3600 * 24));
  }


  return (
    <div className={classes.calendarContainer}>
      <h1>Object reservation: {object?.name}</h1>
      <button onClick={() => setMode("start")} className={mode && mode === "start" ? classes.highlighted : ""}>Select Start ({selectedStart?.toLocaleDateString()})</button>
      <button onClick={() => setMode("end")} className={mode && mode === "end" ? classes.highlighted : ""}>Select End ({selectedEnd?.toLocaleDateString()})</button>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} disabled={currentDate <= today}>
          ← Prev month
        </button>
        <button onClick={() => setCurrentDate(new Date())}>Today</button>
        <button onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
          Next month →
        </button>
      </div>
      <h2 style={{ marginBottom: "10px" }}>{currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
      <Calendar 
        localizer={localizer}
        events={[...events, ...(previewEvent ? [previewEvent] : [])]}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.isPreview ? "green" : "red"
          }
        })}
        selectable
        defaultView="month"
        views={["month"]}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)} 
        onSelectSlot={handleSlotClick}
        toolbar={false}
      />
      <h2>Reservation summary:</h2>
      <ul>
        <li><span className={classes.detailsSpan}>Object:</span> {object?.name}</li>
        <li><span className={classes.detailsSpan}>Object owner:</span> {objectOwner?.first_name} {objectOwner?.last_name}</li>
        <li><span className={classes.detailsSpan}>Selected period:</span> {selectedStart?.toLocaleDateString()} - {selectedEnd?.toLocaleDateString()}</li>
        <li><span className={classes.detailsSpan}>Total price:</span> {object?.day_price_cents/100 * getEventLength(previewEvent)} PLN ({object?.day_price_cents/100} PLN * {getEventLength(previewEvent)} days)</li>
        <li><span className={classes.detailsSpan}>Allowed check in hours:</span> {object?.check_in_start_hour} - {object?.check_in_end_hour}</li>
        <li><span className={classes.detailsSpan}>Allowed check out hours:</span> {object?.check_out_start_hour} - {object?.check_out_end_hour}</li>
        <li><span className={classes.detailsSpan}>Reservation edit/cancel deadline: </span> {object?.reservation_edit_deadline} days</li>
        <li><span className={classes.detailsSpan}>Advance booking required: </span> {object?.advance_days} days</li>
      </ul>
      <h3>You will get the owner's contact info after the reservation is confirmed.</h3>

      <div className={classes.termsForm}>
        <input type='checkbox' className={classes.termsCheckbox} />
        <p className={classes.termsText}>I have read the booking terms and rules and accept them.</p>
      </div>

      <button className={classes.centeredButton}>Confirm reservation</button>
    </div>
  );
}

export default Reservation;