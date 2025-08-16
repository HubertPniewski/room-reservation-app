import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";


function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function doLogout() {
      try {
        await logout();
      } catch (e) {
        console.error('Logout failed', e);
      }
      navigate('/');
    }
    doLogout();
  }, [navigate]);

  return <p>Loging out...</p>
}

export default Logout;