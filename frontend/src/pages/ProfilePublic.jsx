import { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import { useParams } from "react-router-dom";
import ObejctsList from "../components/ObjectsList";


function ProfilePublic() {
  document.title = "User profile";
  const id = useParams();
  const [user, setUser] = useState(null);
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    fetch(`https://127.0.0.1:8000/users/${id.id}/`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then(data => {
        setUser(data);
        return fetch(`https://127.0.0.1:8000/listings/user/${id.id}/`);
      })
      .then(res => {
        if (!res.ok) return { results: [] };
        return res.json();
      })
      .then(data => {
        if (data) {
          setObjects(data.results || []);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  return (
    <>
      <h2>User profile</h2>
      {user ? <UserProfile data={user} /> : <p>Loading...</p>}
      <h2>User's rental objects</h2>
      <ObejctsList items={objects} />
    </>   
  );
}

export default ProfilePublic;