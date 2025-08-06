import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

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