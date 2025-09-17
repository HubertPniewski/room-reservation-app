import classes from './ObjectsList.module.css';
import RentObjectItem from './RentObjectItem';

function ObejctsList({ items }) {
  if (!items || items.length === 0) {
    return <p>No objects to be displayed.</p>;
  }

  return (
    <div className={classes.container}>
      {items.map((obj) => (
        <RentObjectItem key={obj.id} object={obj} />
      ))} 
    </div> 
  );
}

export default ObejctsList;