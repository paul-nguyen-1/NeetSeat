import { useState, useEffect } from "react";
import "./App.css";
import Events from "./components/Events";
import Navbar from "./components/Navbar";

function App() {
  const [searchFilter, setSearchFilter] = useState(false);
  const [list, setList] = useState(null);
  const [meta, setMeta] = useState(null);
  const [navbar, setNavbar] = useState(false);
  const [zipcode, setZipcode] = useState('75201')

  //URL Variables
  const BASE_URL = "https://api.seatgeek.com/2/events?";
  const AMOUNT_PER_PAGE = "&per_page=50";
  const API_KEY = import.meta.env.VITE_API_KEY;
  const CITY_ZIP = "&postal_code=";

  //Enable search filter on nav
  const handleSearchClick = () => {
    setSearchFilter(!searchFilter);
    setNavbar(false);
  };

  //Call and access API for events
  useEffect(() => {
    const fetchAllEvents = async () => {
      const response = await fetch(
        `${BASE_URL}${API_KEY}${AMOUNT_PER_PAGE}${CITY_ZIP}${zipcode}`
      );
      const json = await response.json();
      console.log(json);
      setMeta(json.meta);
      setList(json.events);
    };
    fetchAllEvents().catch(console.error);
  }, []);

  //Get Average Price of Events
  let total_price = 0;
  let num_events = 0;
  //List not iterable so grab event from list first
  if (list) {
    for (let event of list) {
      if (event.stats.average_price) {
        total_price += event.stats.average_price;
        num_events++;
      }
    }
  }
  const average_price =
    num_events > 0 ? (total_price / num_events).toFixed(2) : 0;

  //Return lowest price for all events in city
  let lowestPrice = Infinity;
  if (list) {
    for (let event of list) {
      //Make sure all events list their price and return the min value
      if (
        event.stats &&
        event.stats.lowest_sg_base_price != null &&
        event.stats.lowest_sg_base_price < lowestPrice
      ) {
        lowestPrice = event.stats.lowest_sg_base_price;
      }
    }
  }

  //Return highest price for all events in city
  let highestPrice = -Infinity;
  if (list) {
    for (let event of list) {
      if (event.stats.highest_price > highestPrice) {
        highestPrice = event.stats.highest_price;
      }
    }
  }

  return (
    <div className="App">
      <Navbar
        handleSearchClick={handleSearchClick}
        searchFilter={searchFilter}
        navbar={navbar}
        setNavbar={setNavbar}
      />

      <div className="statsContainer">
        <div className="stat">
          <h2>Dallas Events:</h2>
          <h3>{meta && meta.total}</h3>
        </div>
        <div className="stat">
          <h2>Average Price:</h2>
          <h3>${average_price}</h3>
        </div>
        <div className="stat">
          <h2>Price Range:</h2>
          <h3>
            ${lowestPrice} - ${highestPrice}
          </h3>
        </div>
      </div>
      <div className="eventContainer">
        <div className="eventRow eventTitles">
          <div className="eventColumn">Event Type</div>
          <div className="eventColumn">Date</div>
          <div className="eventColumn">Performance</div>
          <div className="eventColumn">Location</div>
          <div className="eventColumn">Venue</div>
          <div className="eventColumn">Lowest Price</div>
          <div className="eventColumn">Tickets</div>
        </div>

        {list &&
          Object.entries(list).map(([event]) =>
            list[event] ? (
              <Events
                event={list[event].type.toUpperCase().replace(/_/g, " ")}
                date={new Date(list[event].datetime_utc).toLocaleDateString()}
                title={list[event].title}
                location={list[event].venue.display_location}
                venue={list[event].venue.name}
                price={list[event].stats.lowest_sg_base_price}
                url={list[event].url}
                id={list[event].id}
              />
            ) : null
          )}
      </div>
    </div>
  );
}

export default App;
