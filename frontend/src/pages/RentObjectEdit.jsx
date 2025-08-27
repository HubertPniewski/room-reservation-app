import { useParams } from "react-router-dom";
import RentObjectForm from "../components/RentObjectForm";
import { useEffect, useState } from "react";

function RentObjectEdit() {
  const { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    fetch(`https://127.0.0.1:8000/listings/${id}/`)
      .then(res => res.json())
      .then(data => {
        setObject(data);
      })
    .catch(err => console.error(err));
  }, [id]);

  return (
    <>
      <h1>Edit object details</h1>
      <RentObjectForm object={object} />
    </>
  );
}

export default RentObjectEdit;