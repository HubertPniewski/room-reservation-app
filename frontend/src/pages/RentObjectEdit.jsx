import { useParams } from "react-router-dom";
import RentObjectForm from "../components/RentObjectForm";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function RentObjectEdit() {
  const { id } = useParams();
  const [object, setObject] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`https://127.0.0.1:8000/listings/${id}/`)
      .then(res => res.json())
      .then(data => {
        setObject(data);
      })
    .catch(err => console.error(err));
  }, [id]);

  if (!user || !object || user.id !== object.owner) {
    return (<h1>You don't have an access to this website!</h1>);
  } else {
    return (
        <>
          <h1>Edit object details</h1>
          <RentObjectForm object={object} />
        </>
      );
  }

  
}

export default RentObjectEdit;