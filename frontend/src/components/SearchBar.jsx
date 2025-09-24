import { useEffect, useState } from 'react';
import classes from './SearchBar.module.css';
import Slider from "@mui/material/Slider";

function SearchBar({ onSearch, prevFilters }) {
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
    max_price: 5000,
    min_price: 0,
    min_rooms: 0,
    max_rooms: 10,
    min_area: 0,
    max_area: 300,
    pets: false,
    kitchen: false,
    bathroom: false,
    parking: false,
    min_advance: 30,
    max_advance: 500,
    edit_deadline: 50,
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
        <select name="type" id="type" className={classes.selctField} value={filters.type} onChange={handleChange}>
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
          data-testid="price-slider"
          sx={sliderStyles}
          value={[filters.min_price, filters.max_price]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_price: newRange[0],
              max_price: newRange[1],
            }))}
          min={0}
          max={5000}
          step={10}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Rooms: {filters.min_rooms} - {filters.max_rooms}</label>
        <Slider className={classes.slider}
          data-testid="rooms-slider"
          sx={sliderStyles}
          value={[filters.min_rooms, filters.max_rooms]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_rooms: newRange[0],
              max_rooms: newRange[1],
            }))}
          min={0}
          max={10}
          step={1}
        />
      </div>
      <div className={classes.sliderField}>
        <label>Area: {filters.min_area} m² - {filters.max_area} m²</label>
        <Slider className={classes.slider}
          data-testid="area-slider"
          sx={sliderStyles}
          value={[filters.min_area, filters.max_area]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              min_area: newRange[0],
              max_area: newRange[1],
            }))}
          min={0}
          max={300}
          step={1}
        />
      </div>

      {/* checkbox fields */}
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="pets"
          id='pets'
          type="checkbox"
          checked={filters.pets}
          onChange={handleChange}
        />
        <label className={classes.checkboxDetail} htmlFor='pets'>Pets allowed</label>
      </div>
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="kitchen"
          id='kitchen'
          type="checkbox"
          checked={filters.kitchen}
          onChange={handleChange}
        />
        <label className={classes.checkboxDetail} htmlFor='kitchen'>Own kitchen</label>
      </div>
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="bathroom"
          id='bathroom'
          type="checkbox"
          checked={filters.bathroom}
          onChange={handleChange}
        />
        <label className={classes.checkboxDetail} htmlFor='bathroom'>Own bathroom</label>
      </div>
      <div className={classes.checkboxField}>
        <input 
          className={classes.check}
          name="parking"
          id='parking'
          type="checkbox"
          checked={filters.parking}
          onChange={handleChange}
        />
        <label className={classes.checkboxDetail} htmlFor='parking'>Parking place </label>
      </div>

      {/* date-time fields */}
      <div className={classes.sliderField}>
        <label>Minimum reservation advance not more than: {`${filters.min_advance} days`}</label>
        <Slider className={classes.slider}
          data-testid="advance-slider"
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
          data-testid="max_deadline-slider"
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
          data-testid="max_cancel-slider"
          sx={sliderStyles}
          value={[filters.edit_deadline]}
          onChange={(_, newRange) => 
            setFilters(prev => ({
              ...prev,
              edit_deadline: newRange[0],
            }))}
          min={0}
          max={50}
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