import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import classes from './LoginForm.module.css';

function LoginForm({ prevUrl }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(prevUrl);
    } catch (err) {
      console.log(err.message);
      if (err.message == "Invalid credentials") {
        
        setInvalidCredentials(true);
      }
      console.error(err);
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" value={email} placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
      {invalidCredentials && <p className={classes.invalidCredentials}>Invalid email or password</p>}
      <button type="submit">Log in</button>
      <p className={classes.p}>Don't have an account yet? <Link className={classes.link} to="/register">Register now</Link></p>
    </form>
  );
}

export default LoginForm;