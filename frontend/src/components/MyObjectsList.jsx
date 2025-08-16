import "./MyObjectsList.module.css";
import MyObjectItem from "./MyObjectItem";

function MyObjectsList({ objects }) {
  if (!objects) {
    return <p>You have no rental obejcts.</p>
  }
  
  return (
    <ul>
      {objects.map((obj) => (
        <MyObjectItem key={obj.id} object={obj} />
      ))}
    </ul>
  );
}

export default MyObjectsList;