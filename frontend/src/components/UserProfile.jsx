import classes from "./UserProfile.module.css"
import defaultAvatar from "../assets/default_avatar.png";

function UserProfile({ data }) {
  const date_joined = new Date(data.date_joined).toLocaleDateString('pl-PL');
  return (
    <div>
      <img className={classes.profileImg} src={data.profile_image ? data.profile_image : defaultAvatar} alt="Failed to load the profile image" />
      <ul>
        <li><strong>First Name: </strong>{data.first_name}</li>
        <li><strong>Last Name: </strong>{data.last_name}</li>
        {data.email &&
          <>
            <li><strong>Email: </strong>{data.email}</li>
            <li><strong>Phone number: </strong>{data.phone_number}</li>
          </>
        }
        <li><strong>Date joined: </strong>{date_joined}</li>
      </ul>
    </div> 
  );
}

export default UserProfile;