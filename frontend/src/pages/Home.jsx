import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ObejctsList from "../components/ObjectsList";
import classes from "./Home.module.css";
import { useOutletContext, useSearchParams } from "react-router-dom";
import api from "../api.js";


function Home() {
  document.title = "VacationsPlace";
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters, currentPage, sort, setSort, setCurrentPage } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  function cleanParams(filters, sort, page) {
    const params = { ...filters, sort, page }
    if (params.max_price === 5000) delete params.max_price;
    if (params.max_rooms === 10) delete params.max_rooms;
    if (params.max_area === 300) delete params.max_area;
    if (params.edit_deadline === 50) delete params.edit_deadline;
    if (params.min_advance === 60) delete params.min_advance;
    if (params.max_advance === 500) delete params.max_advance;

    Object.keys(params).forEach(key => {
      if (params[key] === "" || params[key] === false || params[key] === undefined) {
        delete params[key];
      }
    });
    return params;
  }

  async function fetchListings() {
    setLoading(true);
    try {
      const params = cleanParams(filters, sort, currentPage);
      const res = await api.get("listings/", { params });

      setObjects(res.data.results);
      setTotalResults(res.data.count);
      setTotalPages(Math.ceil(res.data.count / 20));
    } catch (e) {
      console.error("Fetch listings error: ", e);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(data) {
    setCurrentPage(1);
    setFilters(data);
  }

  useEffect(() => {
    const urlPage = searchParams.get("page");
    const urlSort = searchParams.get("sort");
    if (urlPage) setCurrentPage(parseInt(urlPage));
    if (urlSort) setSort(urlSort);

    const urlFilters= {};
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "sort") urlFilters[key] = value;
    });

    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }

    fetchListings();
  }, []);

  useEffect(() => {
    fetchListings();
    const params = cleanParams(filters, sort, currentPage);
    setSearchParams(params, { replace: true });
  }, [filters, sort, currentPage]);


  if (loading) return <p>Loading...</p>
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