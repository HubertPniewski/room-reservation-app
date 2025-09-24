import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import classes from "./RootLayout.module.css";
import { useState } from "react";


function RootLayout() {
  document.title = "VacationsPlace";
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
    min_price: 0,
    max_price: 5000,
    min_rooms: 0,
    max_rooms: 10,
    min_area: 0,
    max_area: 300,
    pets: false,
    kitchen: false,
    bathroom: false,
    parking: false,
    min_advance: 60,
    max_advance: 500,
    edit_deadline: 50,
  });

  const [sort, setSort] = useState("reviews");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={classes.pageWrapper}>
      <Navbar />
      <main>
        <Outlet context={{ filters, setFilters, sort, setSort, currentPage, setCurrentPage }} />
      </main>
      <footer>
        &copy; 2025 VacationsPlace
      </footer>
    </div>
  );
}

export default RootLayout;