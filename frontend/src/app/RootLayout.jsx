import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import classes from "./RootLayout.module.css";


function RootLayout() {
  return (
    <div className={classes.pageWrapper}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>
        &copy; 2025 VacationsPlace
      </footer>
    </div>
  );
}

export default RootLayout;