import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import classes from "./RootLayout.module.css";
import { useEffect, useState } from "react";


function RootLayout() {
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
    min_price: 0,
    max_price: 5000,
    min_rooms: 0,
    max_rooms: 10,
    min_area: 0,
    max_area: 100,
    pets: false,
    kitchen: false,
    bathroom: false,
    parking: false,
    min_advance: 60,
    max_advance: 500,
  });

  const [limits, setLimits] = useState({
    maxPrice: 5000,
    maxRooms: 10,
    maxArea: 100,
    maxEditDeadline: 14,
  });

  useEffect(() => {
    // fetch all listings once and set limits
    fetch('https://127.0.0.1:8000/listings/')
      .then(res => res.json())
      .then(data => {
        const results = data.results;
        setLimits(() => ({
          maxPrice: Math.max(...results.map(r => r.day_price_cents / 100)),
          maxRooms: Math.max(...results.map(r => r.rooms)),
          maxArea: Math.max(...results.map(r => r.area)),
          maxEditDeadline: Math.max(...results.map(r => r.reservation_edit_deadline)),
        }));

        setFilters(prev => ({
          ...prev,
          max_price: Math.max(...results.map(r => r.day_price_cents / 100)),
          max_rooms: Math.max(...results.map(r => r.rooms)),
          max_area: Math.max(...results.map(r => r.area)),
          edit_deadline: Math.max(...results.map(r => r.reservation_edit_deadline)),
        }));
      });
  }, []);


  return (
    <div className={classes.pageWrapper}>
      <Navbar />
      <main>
        <Outlet context={{ filters, setFilters, limits, setLimits }} />
      </main>
      <footer>
        &copy; 2025 VacationsPlace
      </footer>
    </div>
  );
}

export default RootLayout;