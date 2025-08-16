import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import classes from './LoginForm.module.css';

function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      console.log("Logged in: ", userData);
    } catch (err) {
      console.error("Login error ", err);
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <input type="email" value={email} placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}

export default LoginForm;