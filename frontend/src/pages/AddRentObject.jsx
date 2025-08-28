import RentObjectForm from "../components/RentObjectForm";

function AddRentObject() {
  return (
    <div>
      <h1>Add new rent object</h1>
      <RentObjectForm object={null} />
    </div>
  );
}

export default AddRentObject;