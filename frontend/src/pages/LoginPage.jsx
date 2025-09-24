import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  document.title = "Login";
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  return (
    <LoginForm prevUrl={from} />
  );
}

export default LoginPage;