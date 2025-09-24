import RentObjectForm from "../components/RentObjectForm";

function AddRentObject() {
  document.title = "Add rent object";
  return (
    <div>
      <h1>Add new rent object</h1>
      <RentObjectForm object={null} />
    </div>
  );
}

export default AddRentObject;