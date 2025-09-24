import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import classes from "./LoginForm.module.css";

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the terms!");
      setEmailTaken(false);
      setInvalidPhoneNumber(false);
      return;
    }

    if (password !== password2) {
      alert("Passwords are not the same!");
      setEmailTaken(false);
      setInvalidPhoneNumber(false);
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("password", password);
    formData.append("terms_accepted", termsAccepted ? "true" : "false");
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      if (err.message == "{\"phone_number\":[\"The phone number entered is not valid.\"]}") {
        setInvalidPhoneNumber(true);
      } else {
        setInvalidPhoneNumber(false);
      }
      if (err.message == "{\"email\":[\"user with this email already exists.\"]}") {
        setEmailTaken(true);
      } else {
        setEmailTaken(false);
      }
    }
  }

  return (
    <div>
      <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label htmlFor="firstName">First name<span>*</span></label>
        <input name="firstName" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />

        <label htmlFor="lasstName">Last name<span>*</span></label>
        <input name="lastName" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />

        <label htmlFor="email">Email<span>*</span></label>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          autoComplete="off"
          onInvalid={e => e.target.setCustomValidity("Please enter a valid email address")}
          onInput={e => e.target.setCustomValidity("")}
          required 
        />
        {emailTaken && <p className={classes.invalidCredentials}>An account with this email already exists</p>}

        <label htmlFor="password">Password<span>*</span></label>
        <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

        <label htmlFor="repeatPassword">Repeat password<span>*</span></label>
        <input name="repeatPassword" type="password" placeholder="Repeat password" value={password2} onChange={e => setPassword2(e.target.value)} required />

        <label htmlFor="phoneNumber">Phone number with area code (eg. +48XXXXXXXXX)<span>*</span></label>
        <input name="phoneNumber" type="tel" placeholder="Phone number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
        {invalidPhoneNumber && <p className={classes.invalidCredentials}>Invalid phone number</p>}

        <label htmlFor="profileImage">Profile image (not required)</label>
        <input
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={e => setProfileImage(e.target.files[0])}
        />

        <label className={classes.termsCheckbox} htmlFor="termsAccept">
          <input
            id="termsAccept"
            name="termsAccept"
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
          I have read and accept terms and rules.<span>*</span>
        </label>

        <p><span>* </span> required fields</p>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;