import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ObejctsList from "../components/ObjectsList";
import classes from "./Home.module.css";
import { useOutletContext } from "react-router-dom";


function Home() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters, limits, setLimits, sort, setSort } = useOutletContext();

  function filtersToQueryString(filters) {
    return Object.entries(filters)
      .filter(([_, v]) => v !== "" && v !== false) // eslint-disable-line no-unused-vars
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
  }

  function handleSearch(filters) {
    const query = filtersToQueryString(filters);

    fetch(`https://127.0.0.1:8000/listings/?sort=${sort}&${query}`)
      .then((res) => res.json())
      .then((data) => {
        setObjects(data.results);
        setLoading(false);
      });
  };

  function handleSearchSubmit(data) {
    setFilters(data);
    handleSearch(data);
  }

  useEffect(() => {
    const query = filtersToQueryString(filters);

    fetch(`https://127.0.0.1:8000/listings/?${query}&sort=${sort}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setObjects(data.results);
        if (limits.maxPrice === 5000) {
        setLimits(prev => ({ ...prev, maxPrice: findHighestPrice(data.results) }));
      }
      if (limits.maxRooms === 10) {
        setLimits(prev => ({ ...prev, maxRooms: findHighestRooms(data.results) }));
      }
      if (limits.maxArea === 100) {
        setLimits(prev => ({ ...prev, maxArea: findHighestArea(data.results) }));
      }
      if (limits.maxEditDeadline === 14) {
        setLimits(prev => ({ ...prev, maxEditDeadline: findHighestEditDeadline(data.results) }));
      }
        setLoading(false);
      });
  }, [sort]);

  if (loading) return <p>Loading...</p>

  function findHighestPrice(objectArr) {
    let highest = 0;
    objectArr.forEach(element => {
      if (element['day_price_cents'] > highest) highest = element['day_price_cents'];
    });
    return highest / 100;
  }

  function findHighestRooms(objectArr) {
    let highest = 0;
    objectArr.forEach(element => {
      if (element['rooms'] > highest) highest = element['rooms'];
    });
    return highest;
  }

  function findHighestArea(objectArr) {
    let highest = 0;
    objectArr.forEach(element => {
      if (element['area'] > highest) highest = element['area'];
    });
    return highest;
  }

    function findHighestEditDeadline(objectArr) {
    let highest = 0;
    objectArr.forEach(element => {
      if (element['reservation_edit_deadline'] > highest) highest = element['reservation_edit_deadline'];
    });
    return highest;
  }

  return (
    <div className={classes.homeLayout}>
      <SearchBar onSearch={handleSearchSubmit} highestPrice={limits.maxPrice} highestRooms={limits.maxRooms} highestArea={limits.maxArea} highestDeadline={limits.maxEditDeadline} prevFilters={filters} />
      <div className={classes.homeRightContainer}>
        <div className={classes.sortingContainer}>
          <p className={classes.sortByText}>Sort by: </p>
          <select className={classes.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
            <option value="random">Random</option>
          </select>
        </div>
        <ObejctsList items={objects} />
      </div> 
    </div>
  );
};

export default Home;