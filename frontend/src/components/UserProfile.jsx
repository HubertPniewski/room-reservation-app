import "./UserProfile.module.css"

function UserProfile({ data }) {
  const date_joined = new Date(data.date_joined).toLocaleDateString('pl-PL');
  return (
    <div>
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