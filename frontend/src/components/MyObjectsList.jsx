import "./MyObjectsList.module.css";
import MyObjectItem from "./MyObjectItem";

function MyObjectsList({ objects }) {
  if (!objects) {
    return <p>You have no rental obejcts.</p>
  }

  function handleItemDelete() {
    window.location.reload();
  }
  
  return (
    <ul>
      {objects.map((obj) => (
        <MyObjectItem key={obj.id} object={obj} onDelete={handleItemDelete} />
      ))}
    </ul>
  );
}

export default MyObjectsList;