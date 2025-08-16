import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import classes from "./LoginForm.module.css";

function RegisterForm() {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accepted the terms!");
      return;
    }

    if (password !== password2) {
      alert("Passwords are not the same!");
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

    await register(formData);
  }

  return (
    <div>
      <h1>Register</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name<span>*</span></label>
        <input name="firstName" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />

        <label htmlFor="lasstName">Last name<span>*</span></label>
        <input name="lastName" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />

        <label htmlFor="email">Email<span>*</span></label>
        <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label htmlFor="password">Password<span>*</span></label>
        <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

        <label htmlFor="repeatPassword">Repeat password<span>*</span></label>
        <input name="repeatPassword" type="password" placeholder="Repeat password" value={password2} onChange={e => setPassword2(e.target.value)} required />

        <label htmlFor="phoneNumber">Phone number<span>*</span></label>
        <input name="phoneNumber" type="tel" placeholder="Phone number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />

        <label htmlFor="profileImage">Profile image (not required)</label>
        <input
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={e => setProfileImage(e.target.files[0])}
        />

        <label className={classes.termsCheckbox} htmlFor="termsAccept">
          <input
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