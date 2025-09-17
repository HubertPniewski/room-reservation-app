import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ObejctsList from "../components/ObjectsList";
import classes from "./Home.module.css";
import { useOutletContext } from "react-router-dom";


function Home() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters, currentPage, sort, setSort, setCurrentPage } = useOutletContext();
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  function filtersToQueryString(filters) {
    return Object.entries(filters)
      .filter(([_, v]) => v !== "" && v !== false) // eslint-disable-line no-unused-vars
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
  }

  function handleSearch(filters) {
    let query = filtersToQueryString(filters);
    
    query = query.replace("max_price=5000", "");
    query = query.replace("max_rooms=10", "");
    query = query.replace("max_area=300", "");
    query = query.replace("edit_deadline=50", "");
    query = query.replace("min_advance=60", "");
    query = query.replace("max_advance=500", "");

    fetch(`https://127.0.0.1:8000/listings/?sort=${sort}&${query}`)
      .then((res) => res.json())
      .then((data) => {
        setObjects(data.results);
        setLoading(false);
      });
  };

  function handleSearchSubmit(data) {
    setFilters(data);
    //setPagesNumber(1);
    handleSearch(data);
  }

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      const query = filtersToQueryString(filters);
      const res = await fetch(`https://127.0.0.1:8000/listings/?${query}&sort=${sort}&page=${currentPage}`);
      const data = await res.json();
      setObjects(data.results);
      setTotalResults(data.count);
      setTotalPages(Math.ceil(data.count / 20));
      setLoading(false);
    }
    fetchPage();
  }, [filters, sort, currentPage]);

  if (loading) return <p>Loading...</p>
  console.log()
  return (
    <div className={classes.homeLayout}>
      <SearchBar onSearch={handleSearchSubmit} prevFilters={filters} />
      <div className={classes.homeRightContainer}>
        <div className={classes.sortingContainer}>
          <p className={classes.sortByText}>Sort by: </p>
          <select className={classes.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
            <option value="random">Random</option>
          </select>
        </div>
        <p className={classes.resultsCount}>{totalResults} objects found</p>
        <ObejctsList items={objects} />
        <div className={classes.pagesContainer}>
          <button 
            className={classes.pageButton} 
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(prev => prev - 1);
              }
            }}
            disabled={currentPage <= 1}
          >{"<"}</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              className={classes.pageButton}
              key={i}
              disabled={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className={classes.pageButton} 
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
              }
            }}
            disabled={currentPage >= totalPages}
          >{">"}</button>
        </div>
      </div> 
    </div>
  );
};

export default Home;