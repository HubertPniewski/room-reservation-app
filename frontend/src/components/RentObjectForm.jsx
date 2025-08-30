import { useState, useEffect } from "react";
import classes from "./RentObjectForm.module.css";
import { useNavigate } from "react-router-dom";

function RentObjectForm({ object }) {
  const navigate = useNavigate();
  const [name, setName] = useState(object?.name || "");
  const [rentalType, setRentalType] = useState(object?.rental_type || "room");
  const [rooms, setRooms] = useState(object?.rooms || 1);
  const [area, setArea] = useState(object?.area || 0);
  const [address, setAddress] = useState(object?.address || "");
  const [town, setTown] = useState(object?.town || "");
  const [price, setPrice] = useState(object?.day_price_cents || 0);
  const [petsAllowed, setPetsAllowed] = useState(object?.pets_allowed || false);
  const [ownKitchen, setOwnKitchen] = useState(object?.own_kitchen || false);
  const [ownBathroom, setOwnBathroom] = useState(object?.own_bathroom || false);
  const [parkingPlace, setParkingPlace] = useState(object?.parking_place || false);
  const [images, setImages] = useState(object?.images?.map(img => ({ ...img, isNew: false })) || []);
  const [reservationEditDeadline, setReservationEditDeadline] = useState(object?.reservation_edit_deadline || 7);
  const [reservationBreak, setReservationBreak] = useState(object?.reservation_break_minutes || 600);
  const [checkInStart, setCheckInStart] = useState(object?.check_in_start_hour || "");
  const [checkInEnd, setCheckInEnd] = useState(object?.check_in_end_hour || "");
  const [checkOutStart, setCheckOutStart] = useState(object?.check_out_start_hour || "");
  const [checkOutEnd, setCheckOutEnd] = useState(object?.check_out_end_hour || "");
  const [description, setDescription] = useState(object?.description || "");
  
  
  useEffect(() => {
    if (!object) return;
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
    if (object?.check_in_out_start_hour) setCheckInStart(object.check_in_start_hour);
    if (object?.check_in_out_end_hour) setCheckInEnd(object.check_in_end_hour);
    if (object?.check_in_out_start_hour) setCheckOutStart(object.check_out_start_hour);
    if (object?.check_in_out_end_hour) setCheckOutEnd(object.check_out_end_hour);
    if (object?.description) setDescription(object.description);
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
    navigate(`/listings/${object.id}`)
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
    formData.append("check_in_start_hour", checkInStart);
    formData.append("check_in_end_hour", checkInEnd);
    formData.append("check_out_start_hour", checkOutStart);
    formData.append("check_out_end_hour", checkOutEnd);
    formData.append("description", description);

    images.forEach(img => {
      if (img.isNew) {
        formData.append("new_images", img.file);
        formData.append("new_images_indexes[]", img.index);
      } else if (object) {
        formData.append("images_data[]", JSON.stringify({ id: img.id, index: img.index }));
      }
    });

    const url = object ?
      `https://127.0.0.1:8000/listings/${object.id}/` : // edit existing one
      "https://127.0.0.1:8000/listings/";               // add new one
    const method = object ? "PATCH" : "POST";

    const res = await fetch(url, {
      method: method,
      body: formData,
      credentials: "include"
    });

    const data = await res.json();
    navigate(`/listings/${data.id}`);
  }


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

        <label htmlFor="description">Description</label>
        <textarea cols="67" rows="20" name="description" id="description" value={description} onChange={e => setDescription(e.target.value)} />

        <label htmlFor="pets_allowed">Pets allowed</label>
        <input type="checkbox" name="pets_allowed" id="pets_allowed" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} />

        <label htmlFor="own_kitchen">Own kitchen</label>
        <input type="checkbox" name="own_kitchen" id="own_kitchen" checked={ownKitchen} onChange={e => setOwnKitchen(e.target.checked)} />

        <label htmlFor="own_bathroom">Own bathroom</label>
        <input type="checkbox" name="own_bathroom" id="own_bathroom" checked={ownBathroom} onChange={e => setOwnBathroom(e.target.checked)} />

        <label htmlFor="parking_place">Parking place</label>
        <input type="checkbox" name="parking_place" id="parking_place" checked={parkingPlace} onChange={e => setParkingPlace(e.target.checked)} />

        <label htmlFor="reservation_edit_deadline">Reservation edit deadline [days]</label>
        <input type="number" name="reservation_edit_deadline" id="reservation_edit_deadline" value={reservationEditDeadline} onChange={e => setReservationEditDeadline(e.target.value)} />

        <label htmlFor="reservation_break_minutes">Min. interval beetwen reservations [min] ({Math.floor(reservationBreak / 60)} h {reservationBreak % 60} min)</label>
        <input type="number" name="reservation_break_minutes" id="reservation_break_minutes" value={reservationBreak} onChange={e => setReservationBreak(e.target.value)} />

        <label>Check in hours:</label>
        <div className={classes.hoursContainer}>
          <input type="time" name="check_in_start_hour" id="check_in_start_hour" value={checkInStart} onChange={e => setCheckInStart(e.target.value)} />
          <h2> - </h2>
          <input type="time" name="check_in_end_hour" id="check_in_end_hour" value={checkInEnd} onChange={e => setCheckInEnd(e.target.value)} />
        </div>

        <label>Check out hours:</label>
        <div className={classes.hoursContainer}>
          <input type="time" name="check_out_start_hour" id="check_out_start_hour" value={checkOutStart} onChange={e => setCheckOutStart(e.target.value)} />
          <h2> - </h2>
          <input type="time" name="check_out_end_hour" id="check_out_end_hour" value={checkOutEnd} onChange={e => setCheckOutEnd(e.target.value)} />
        </div>

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
      </form>
    </div>
  );
}

export default RentObjectForm;