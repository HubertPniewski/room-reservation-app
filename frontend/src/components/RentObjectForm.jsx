import { useEffect, useState } from "react";
import classes from "./RentObjectForm.module.css";

function RentObjectForm({ object }) {
  const [name, setName] = useState("");
  const [rentalType, setRentalType] = useState("room");
  const [rooms, setRooms] = useState(1);
  const [area, setArea] = useState(0);
  const [address, setAddress] = useState("");
  const [town, setTown] = useState("");
  const [price, setPrice] = useState(0);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [ownKitchen, setOwnKitchen] = useState(false);
  const [ownBathroom, setOwnBathroom] = useState(false);
  const [parkingPlace, setParkingPlace] = useState(false);
  const [images, setImages] = useState([]);
  const [reservationEditDeadline, setReservationEditDeadline] = useState(7);
  const [reservationBreak, setReservationBreak] = useState(600);
  const [checkInOutStart, setCheckInOutStart] = useState("");
  const [checkInOutEnd, setCheckInOutEnd] = useState("");
  
  useEffect(() => {
    if (object?.name) setName(object.name);
    if (object?.rental_type) setRentalType(object.rental_type);
    if (object?.rooms) setRooms(object.rooms);
    if (object?.area) setArea(object.area);
    if (object?.address) setAddress(object.address);
    if (object?.town) setTown(object.town);
    if (object?.day_price_cents) setPrice(object.day_price_cents);
    if (object?.pets_allowed) setPetsAllowed(object.pets_allowed);
    if (object?.own_kitchen) setOwnKitchen(object.own_kitchen);
    if (object?.own_bathroom) setOwnBathroom(object.own_bathroom);
    if (object?.parking_place) setParkingPlace(object.parking_place);
    if (object?.images) setImages(object.images.map(img => ({ ...img, isNew: false })));
    if (object?.reservation_edit_deadline) setReservationEditDeadline(object.reservation_edit_deadline);
    if (object?.reservation_break_minutes) setReservationBreak(object.reservation_break_minutes);
    if (object?.check_in_out_start_hour) setCheckInOutStart(object.check_in_out_start_hour);
    if (object?.check_in_out_end_hour) setCheckInOutEnd(object.check_in_out_end_hour);
  }, [object])

  async function handleAddImages(e) {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: `temp-${file.name}-${Date.now()}`,
      isNew: true,
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newFiles]);
  }

  function moveImage(index, direction) {
    setImages(prev => {
      const newArr = [...prev];
      const targetIndex = direction === 'u' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

      [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
      
      const updated = newArr.map((img, index) => ({
        ...img,
        index: index,
      }));

      return updated;
    });
  }

  function handleCancel() {
    if (object?.images) {
      setImages(images.map(img => ({ ...img, isNew: false })));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("rental_type", rentalType);
    formData.append("rooms", rooms);
    formData.append("area", area);
    formData.append("address", address);
    formData.append("town", town);
    formData.append("day_price_cents", price);
    formData.append("pets_allowed", petsAllowed);
    formData.append("own_kitchen", ownKitchen);
    formData.append("own_bathroom", ownBathroom);
    formData.append("parking_place", parkingPlace);
    formData.append("reservation_edit_deadline", reservationEditDeadline);
    formData.append("reservation_break_minutes", reservationBreak);
    formData.append("check_in_out_start_hour", checkInOutStart);
    formData.append("check_in_out_end_hour", checkInOutEnd);

    images.forEach(img => {
      if (img.isNew) {
        images.append("new_images", img.file);
        formData.append("new_images_indexes[]", img.index);
      } else {
        formData.append("images_data[]", JSON.stringify({ id: img.id, index: img.index }));
      }
    });

    const res = await fetch(`https://127.0.0.1:8000/listings/${object.id}/`, {
      method: "PATCH",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();
    console.log(data);
  }

  if (!object) return <p>Loading...</p>;

  return (
    <div className={classes.formContainer}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="name">Object name</label>
        <input name="name" id="name" value={name} onChange={e => setName(e.target.value)} required />

        <label htmlFor="rental_type">Rental type</label>
        <select name="rental_type" id="rental_type" value={rentalType} onChange={e => setRentalType(e.target.value)}>
          <option value="room">Room</option>
          <option value="apartment">Apartment</option>
          <option value="cottage">Cottage</option>
        </select>

        <label htmlFor="rooms">Rooms</label>
        <input type="number" name="rooms" id="rooms" value={rooms} onChange={e => setRooms(e.target.value)} min="0" required />

        <label htmlFor="area">Area (m²)</label>
        <input type="number" step="0.01" name="area" id="area" value={area} onChange={e => setArea(e.target.value)} min="0" required />

        <label htmlFor="address">Address</label>
        <input name="address" id="address" value={address} onChange={e => setAddress(e.target.value)} required />

        <label htmlFor="town">Town</label>
        <input name="town" id="town" value={town} onChange={e => setTown(e.target.value)} required />

        <label htmlFor="day_price_cents">Price per day (PLN)</label>
        <input type="number" step="0.01" name="day_price_cents" id="day_price_cents" value={price/100} onChange={e => setPrice(e.target.value * 100)} min="0" required />

        <label htmlFor="pets_allowed">Pets allowed</label>
        <input type="checkbox" name="pets_allowed" id="pets_allowed" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} />

        <label htmlFor="own_kitchen">Own kitchen</label>
        <input type="checkbox" name="own_kitchen" id="own_kitchen" checked={ownKitchen} onChange={e => setOwnKitchen(e.target.checked)} />

        <label htmlFor="own_bathroom">Pets allowed</label>
        <input type="checkbox" name="own_bathroom" id="own_bathroom" checked={ownBathroom} onChange={e => setOwnBathroom(e.target.checked)} />

        <label htmlFor="parking_place">Pets allowed</label>
        <input type="checkbox" name="parking_place" id="parking_place" checked={parkingPlace} onChange={e => setParkingPlace(e.target.checked)} />

        <label htmlFor="reservation_edit_deadline">Reservation edit deadline [days]</label>
        <input type="number" name="reservation_edit_deadline" id="reservation_edit_deadline" value={reservationEditDeadline} onChange={e => setReservationEditDeadline(e.target.value)} />

        <label htmlFor="reservation_break_minutes">Min. interval beetwen reservations [min] ({Math.floor(reservationBreak / 60)} h {reservationBreak % 60} min)</label>
        <input type="number" name="reservation_break_minutes" id="reservation_break_minutes" value={reservationBreak} onChange={e => setReservationBreak(e.target.value)} />

        <label>Check in/out:</label>

        <label htmlFor="check_in_out_start_hour">from:</label>
        <input type="time" name="check_in_out_start_hour" id="check_in_out_start_hour" value={checkInOutStart} onChange={e => setCheckInOutStart(e.target.value)} />
        
        <label htmlFor="check_in_out_end_hour">to:</label>
        <input type="time" name="check_in_out_end_hour" id="check_in_out_end_hour" value={checkInOutEnd} onChange={e => setCheckInOutEnd(e.target.value)} />

        <h3>Images (the first one will be the thumbnail)</h3>
        <div className={classes.photosContainer}>
          <>
            {images && images.map((image, index) => (
              <div key={image.id} className={classes.singlePhoto}>
                <div className={classes.positionArrows}>
                  <button type="button" className={classes.upDownButton} onClick={() => moveImage(index, 'u')}>↑</button>
                  <button type="button" className={classes.upDownButton} onClick={() => moveImage(index, 'd')}>↓</button>
                </div>
                <img className={classes.detailImage} src={image.isNew ? image.preview : image.image_url} />
              </div>
            ))}
            <h3>Add new image</h3>  
            <input
              name="addImg"
              type="file"
              accept="image/*"
              onChange={handleAddImages}
              multiple
            />
          </>
        </div>

        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>

        {/* <button
          style={{ marginBottom: "150px" }}
        >Save</button> */}
      </form>
    </div>
  );
}

export default RentObjectForm;