import { useEffect, useState } from 'react';
import classes from './SearchBar.module.css';
import Slider from "@mui/material/Slider";

function SearchBar({ onSearch, highestPrice, highestRooms, highestArea, highestDeadline, prevFilters }) {
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
    max_price: highestPrice,
    min_price: 0,
    min_rooms: 0,
    max_rooms: highestRooms,
    min_area: 0,
    max_area: highestArea,
    pets: false,
    kitchen: false,
    bathroom: false,
    parking: false,
    min_advance: 30,
    max_advance: 500,
    edit_deadline: highestDeadline,
  });

  useEffect(() => {
    if (prevFilters) {
      setFilters(prevFilters);
    }
  }, [prevFilters]);


  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  }

  const sliderStyles={
    width: '80%',
    margin: '12px auto',
    '& .MuiSlider-thumb': {
      backgroundColor: '#004931',
      border: '2px solid #ffffffff',
    },
    '& .MuiSlider-track': {
      backgroundColor: '#ffffffff',
      border: '3px solid #ffffffff'
    },
    '& .MuiSlider-rail': {
      opacity: 0.35,
      backgroundColor: '#ffffffff',
    },
  };

  return (
    <form className={classes.searchBar} onSubmit={handleSubmit}>
      <div className={classes.formField}>
        <label htmlFor="name">Object name </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name of the object"
          value={filters.name}
          onChange={handleChange}
        />
      </div>
      <div className={classes.formField}>
        <label htmlFor="type">Object type</label>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Any</option>
          <option value="room">Room</option>
          <option value="cottage">Cottage</option>
          <option value="apartment">Apartment</option>
        </select>
      </div>
      <div className={classes.formField}>
        <label htmlFor="location">Location</label>
        <input 
          name="location"
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Price: {filters.min_price} zł - {filters.max_price} zł</label>
        <Slider className={classes.slider}
          sx={sliderStyles}
          value={[filters.min_price, filters.max_price]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_price: newRange[0],
              max_price: newRange[1],
            }))}
          min={0}
          max={highestPrice}
          step={10}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Rooms: {filters.min_rooms} - {filters.max_rooms}</label>
        <Slider className={classes.slider}
          sx={sliderStyles}
          value={[filters.min_rooms, filters.max_rooms]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_rooms: newRange[0],
              max_rooms: newRange[1],
            }))}
          min={0}
          max={highestRooms}
          step={1}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Area: {filters.min_area} m² - {filters.max_area} m²</label>
        <Slider className={classes.slider}
          sx={sliderStyles}
          value={[filters.min_area, filters.max_area]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_area: newRange[0],
              max_area: newRange[1],
            }))}
          min={0}
          max={highestArea}
          step={1}
        />
      </div>

      {/* checkbox fields */}
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="pets"
          type="checkbox"
          checked={filters.pets}
          onChange={handleChange}
        />
        <p className={classes.checkboxDetail}>Pets allowed</p>
      </div>
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="kitchen"
          type="checkbox"
          checked={filters.kitchen}
          onChange={handleChange}
        />
        <p className={classes.checkboxDetail}>Own kitchen</p>
      </div>
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="bathroom"
          type="checkbox"
          checked={filters.bathroom}
          onChange={handleChange}
        />
        <p className={classes.checkboxDetail}>Own bathroom</p>
      </div>
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="parking"
          type="checkbox"
          checked={filters.parking}
          onChange={handleChange}
        />
        <p className={classes.checkboxDetail}>Parking place </p>
      </div>

      {/* date-time fields */}
      <div className={classes.sliderField}>
        <label>Minimum reservation advance not more than: {`${filters.min_advance} days`}</label>
        <Slider className={classes.slider}
          sx={sliderStyles}
          value={[filters.min_advance]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_advance: newRange[0],
            }))}
          min={0}
          max={60}
          step={1}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Maximum reservation advance: {filters.max_advance == 0 ? "no limit" : `${filters.max_advance} days`}</label>
        <Slider className={classes.slider}
          sx={sliderStyles}
          value={[filters.max_advance]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              max_advance: newRange[0],
            }))}
          min={0}
          max={500}
          step={1}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Maximum reservation cancel deadline: {filters.edit_deadline == 0 ? "no limit" : `${filters.edit_deadline} days`}</label>
        <Slider className={classes.slider}
          sx={sliderStyles}
          value={[filters.edit_deadline]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              edit_deadline: newRange[0],
            }))}
          min={0}
          max={highestDeadline}
          step={1}
        />
      </div>

      <div className={classes.formField}>
        <label>&nbsp;</label>
        <button type="submit" className={classes.button}>Search</button>
      </div>
    </form>
  );
}

export default SearchBar;