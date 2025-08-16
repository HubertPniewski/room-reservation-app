import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./RootLayout.module.css";

function RootLayout() {
  return (
    <div>
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