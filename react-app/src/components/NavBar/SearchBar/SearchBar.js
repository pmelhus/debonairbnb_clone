import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SearchDestinationInput from "./SearchDestinationInput/SearchDestinationInput";
import SearchDurationInput from "./SearchDurationInput/SearchDurationInput";
import SearchGuestsInput from "./SearchGuestsInput/SearchGuestsInput";
import { createResults } from "../../../store/search";
// import AnimatedButton from "./AnimatedButton/AnimatedButton"

import "./SearchBar.css";

function SearchBar() {
  const dispatch = useDispatch();
  const [showDestinationMenu, setShowDestinationMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showGuestsMenu, setShowGuestsMenu] = useState(false);
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [guestNumber, setGuestNumber] = useState(1);
  const estates = useSelector((state) => Object.values(state.estates));
  const history = useHistory();

  const openDestinationMenu = (e) => {
    e.stopPropagation();
    if (showDestinationMenu) return;
    setShowDestinationMenu(true);
    setShowDateMenu(false);
    setShowGuestsMenu(false);
  };
  const openDateMenu = (e) => {
    e.stopPropagation();
    if (showDateMenu) return;
    setShowDateMenu(true);
    setShowGuestsMenu(false);
    setShowDestinationMenu(false);
  };
  const openGuestsMenu = (e) => {
    e.stopPropagation();
    if (showGuestsMenu) return;
    setShowGuestsMenu(true);
    setShowDestinationMenu(false);
    setShowDateMenu(false);
  };

  useEffect(() => {
    if (!showDestinationMenu && !showDateMenu && !showGuestsMenu) return;

    const closeForms = () => {
      setShowDestinationMenu(false);
      setShowDateMenu(false);
      setShowGuestsMenu(false);
    };

    document.addEventListener("click", closeForms);

    return () => document.removeEventListener("click", closeForms);
  }, [showDestinationMenu, showDateMenu, showGuestsMenu]);

  // Submits filtered search results to store and redirects to link which displays results
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredEstateResults = estates.filter((estate) => {
      return estate.state === destination;
    });
    dispatch(createResults(filteredEstateResults));
    let searchUrlArray = [];
    filteredEstateResults.map((estate) => {
      searchUrlArray.push(estate.id);
    });
    console.log(searchUrlArray);
    return history.push(`/search?estateids=${searchUrlArray.join(",")}`);
  };

  return (
    <div className="search-container">
      <div className="search-buttons-container">
        {/* <AnimatedButton /> */}
        <button onClick={openDestinationMenu}>
          <p>Anywhere</p>
        </button>
        <button onClick={openDateMenu}>
          <p>Any Week</p>
        </button>
        <button onClick={openGuestsMenu}>
          <p>Add guests</p>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="search-inputs"
        onClick={(e) => e.stopPropagation()}
      >
        {showDestinationMenu && (
          <SearchDestinationInput setDestination={setDestination} />
        )}
        {showDateMenu && <SearchDurationInput setDateRange={setDateRange} />}
        {showGuestsMenu && (
          <SearchGuestsInput setGuestNumber={setGuestNumber} />
        )}
      </form>
    </div>
  );
}

export default SearchBar;
