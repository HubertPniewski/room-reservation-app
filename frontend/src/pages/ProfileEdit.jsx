import { useEffect, useRef, useState } from "react";
import classes from "./ProfileEdit.module.css";
import defaultAvatar from "../assets/default_avatar.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfileEdit() {
  document.title = "Edit profile";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const { login, logout } = useContext(AuthContext);
  const prevEmail = useRef("");
  const userId = useRef("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [password2, setPassword2] = useState("");
  const [invalidPassword2, setInvalidPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://127.0.0.1:8000/users/me/', {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhoneNumber(data.phone_number);
        setOldImage(data.profile_image);
        prevEmail.current = data.email;
        userId.current = data.id;
      })
      .catch(err => console.error(err));
  }, []);

  async function handleAccountDataEdit(e) {
    e.preventDefault();
    setInvalidPassword(false);
    setInvalidPhoneNumber(false);
    setEmailTaken(false);

    try {
      await login(prevEmail.current, password);
    } catch (err) {
      setInvalidPassword(true);
      console.error(err);
      return;
    }

    const formData = new FormData();
    formData.append("id", userId.current);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    } else if (oldImage == "") {
      formData.append("profile_image", "");
    }

    try {
      const res = await fetch(`https://127.0.0.1:8000/users/${userId.current}/`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
          
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch {() => {}}
        if (data?.phone_number) setInvalidPhoneNumber(true);
        if (data?.email) setEmailTaken(true);
        throw new Error(`Failed to update the profile data`);
      }
      
      setInvalidPassword(false);
      navigate("/profile/")
      
    } catch (err) {
      console.error(err);
    }
  }

    async function handlePasswordChange(e) {
    e.preventDefault();
    setInvalidPassword2(false);

    if (newPassword !== newPassword2) {
      setInvalidPassword2(true);
      return;
    }

    try {
      const res = await fetch(`https://127.0.0.1:8000/users/auth/change-password/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ old_password: password2, new_password: newPassword }),
      });
          
      if (res.ok) {
        const data = await res.json();
        alert(data.detail);
        logout();
        navigate("/login/");
      } else {
        const error = await res.json();
        alert(error.old_password?.[0] || error.new_password?.[0] || "Failed to change password");
      }     
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={classes.profileEditContainer}>
      <h1>Edit profile</h1>
      <form onSubmit={handleAccountDataEdit}>
        
        <div className={classes.editSection}>
          <h3>Personal data</h3>
          <label htmlFor="firstName">First name<span>*</span></label>
          <input name="firstName" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />

          <label htmlFor="lasstName">Last name<span>*</span></label>
          <input name="lastName" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>

        <div className={classes.editSection}>
          <h3>Contact data</h3>
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

          <label htmlFor="phoneNumber">Phone number with area code (eg. +48XXXXXXXXX)<span>*</span></label>
          <input name="phoneNumber" type="tel" placeholder="Phone number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
          {invalidPhoneNumber && <p className={classes.invalidCredentials}>Invalid phone number</p>}
        </div>
        
        <div className={classes.editSection}>
          <h3>Profile image</h3>
          <img className={classes.profileImg} src={profileImage ? URL.createObjectURL(profileImage) : oldImage || defaultAvatar} alt="Failed to load the profile image" />
          <label htmlFor="profileImage">Change profile image</label>
          <input
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={e => setProfileImage(e.target.files[0])}
          />
          <button type="button" onClick={() => {setOldImage(""); setProfileImage(null);}}>Delete profile image</button>
        </div>

        <div className={classes.editSection}>
          <h3>To apply changes, type your password</h3>
          <label htmlFor="password">Password<span>*</span></label>
          <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {invalidPassword ? <p>Invalid password!</p> : ""}

          <label><span>*</span> - required fields</label>
          <button>Apply changes</button>
        </div>      
      </form>

      <div className={classes.separatingDiv} /> 

      <h1>Change password</h1>
      <form onSubmit={handlePasswordChange}>
        <div className={classes.editSection}>
          <label htmlFor="newPassword">New password<span>*</span></label>
          <input name="newPassword" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />

          <label htmlFor="newPassword2">Repeat new password<span>*</span></label>
          <input name="newPassword2" type="password" placeholder="Repeat new password" value={newPassword2} onChange={e => setNewPassword2(e.target.value)} required />

          <label htmlFor="password2">Old password<span>*</span></label>
          <input name="password2" type="password" placeholder="Old password" value={password2} onChange={e => setPassword2(e.target.value)} required />
          {invalidPassword2 ? <p>Invalid password!</p> : ""}

          <label><span>*</span> - required fields</label>
          <button>Apply changes</button>
        </div>        
      </form>
    </div>
  );
}

export default ProfileEdit;