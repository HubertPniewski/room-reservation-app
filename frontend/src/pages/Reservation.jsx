import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pl";
import classes from "./Reservation.module.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
  const [termsAccepted, setTermsAccpeted] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

      if (!isRangeFree(events, selectedStart, selectedEnd)) {
        alert("This range is not available!")
        setSelectedStart(null);
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
  }, [selectedStart, selectedEnd, events]);

  useEffect(() => {
    let objectData = null;
    fetch(`https://127.0.0.1:8000/listings/${id}/`)
      .then(res => res.json())
      .then(data => {
        setObject(data);
        objectData = data;
        return data;
      })
      .then(data => fetch(`https://127.0.0.1:8000/users/${data.owner}/`))
      .then(res => res.json())
      .then(data => {
        setObjectOwner(data);
      })
      .then(() => {
        return fetch(`https://127.0.0.1:8000/reservations/object/${id}/`);
      })
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.flatMap(event => [{
          title: "Reserved",
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: true,
        },
        {
          title: "Unavailable",
          start: new Date(new Date(event.end_date).getTime() + 24 * 3600 * 1000),
          end: new Date(new Date(event.end_date).getTime() + (24 * 3600 * 1000 * objectData.reservation_break_days)),
          allDay: true,
        }
      ]);
        formattedEvents.push({
          title: "Past",
          start: new Date(today.getTime() - 60 * 24 * 3600 * 1000),
          end: new Date(today.getTime() - 24 * 3600 * 1000),
          allDay: true,
        },
        {
          title: `Too late. Minimum advance: ${objectData.advance_days} days`,
          start: today,
          end: new Date(today.getTime() + objectData.advance_days * 24 * 3600 * 1000),
          allDay: true,
        },
        {
          title: `Too early. Maximum advance: ${objectData.max_advance_days} days`,
          start: new Date(today.getTime() + objectData.max_advance_days * 24 * 3600 * 1000),
          end: new Date("9999-12-31"),
          allDay: true,
        });
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

  function isRangeFree(events, start, end) {
    return !events.some(ev => (start < ev.end && end > ev.start - 1000 * 24 * 3600));
  }

  function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function handleSubmit() {
    const user_id = user?.id;
    const start_date = previewEvent?.start;
    const end_date = previewEvent?.end;

    if (!user_id) {
      alert("You must be logged in to make a reservation!");
      return;
    }
    if (!start_date || !end_date) {
      alert("Choose a valid time range before making the reservation!");
      return;
    } 

    const reservation = {
      object: object.id,
      user: user.id,
      start_date: formatLocalDate(previewEvent.start),
      end_date: formatLocalDate(new Date(previewEvent.end.getTime() - 24*3600*1000)), // because you added 1 day for inclusive end
    };
    if (termsAccepted) {
      try {
        const res = await fetch("https://127.0.0.1:8000/reservations/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify(reservation)
        });
        if (res.ok) {
          navigate(`/profile/`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("You must accept the terms and rules before making the reservation!");
    }
  }


  return (
    <div className={classes.calendarContainer}>
      <h1>Object reservation: {object?.name}</h1>
      <button onClick={() => {setMode("start"); setPreviewEvent(null)}} className={mode && mode === "start" ? classes.highlighted : ""}>Select Start ({selectedStart?.toLocaleDateString()})</button>
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
            backgroundColor: event.isPreview ? "green" : event.title == "Reserved" ? "red" : "gray"
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
        <li><span className={classes.detailsSpan}>Selected period:</span> {previewEvent?.start?.toLocaleDateString()} - {new Date(previewEvent?.end?.getTime() - 24000 * 3600)?.toLocaleDateString()}</li>
        <li><span className={classes.detailsSpan}>Total price:</span> {object?.day_price_cents/100 * getEventLength(previewEvent)} PLN ({object?.day_price_cents/100} PLN * {getEventLength(previewEvent)} days)</li>
        <li><span className={classes.detailsSpan}>Allowed check in hours:</span> {object?.check_in_start_hour} - {object?.check_in_end_hour}</li>
        <li><span className={classes.detailsSpan}>Allowed check out hours:</span> {object?.check_out_start_hour} - {object?.check_out_end_hour}</li>
        <li><span className={classes.detailsSpan}>Reservation edit/cancel deadline: </span> {object?.reservation_edit_deadline} days</li>
        <li><span className={classes.detailsSpan}>Advance booking required: </span> {object?.advance_days} days</li>
      </ul>
      <h3>You will get the owner's contact info after the reservation is confirmed.</h3>

      <div className={classes.termsForm}>
        <input type='checkbox' className={classes.termsCheckbox} checked={termsAccepted} onChange={e => setTermsAccpeted(e.target.checked)} />
        <p className={classes.termsText}>I have read the booking terms and rules and accept them.</p>
      </div>

      <button className={classes.centeredButton} onClick={handleSubmit}>Confirm reservation</button>
    </div>
  );
}

export default Reservation;