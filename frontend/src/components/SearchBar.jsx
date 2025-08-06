import { useState } from 'react';
import classes from './SearchBar.module.css';

function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
    maxPrice: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefaul();
    if (onSearch) onSearch(filters);
  }

  return (
    <form className={classes.searchBar} onSubmit={handleSubmit}>
       <div className={classes.formField}>
        <label htmlFor="name">Type to search</label>
        <input
          id="name"
          name="name"
          type="text"
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
      <div className={classes.formField}>
        <label htmlFor="maxPrice">Max price (zł)</label>
        <input 
          name="maxPrice"
          type="number"
          placeholder="Max price (zł)"
          value={filters.maxPrice}
          onChange={handleChange}
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