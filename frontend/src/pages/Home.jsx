import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ObejctsList from "../components/ObjectsList";

function Home() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleSearch(filters) {
    console.log("Search with filters:", filters)
  };

  useEffect(() => {
    fetch('https://127.0.0.1:8000/listings/')
      .then((res) => res.json())
      .then((data) => {
        setObjects(data.results);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ObejctsList items={objects} />
    </div>
  );
};

export default Home;