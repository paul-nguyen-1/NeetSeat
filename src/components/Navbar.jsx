import React from "react";
import { useEffect } from "react";
import "../App.css";
import { Input } from "semantic-ui-react";
import { Link } from "react-router-dom";

function Navbar({
  handleSearchClick,
  searchFilter,
  navbar,
  setNavbar,
  handleSearchEvent,
}) {
  //blur effect for navbar when scrolling
  const changeBackground = () => {
    // console.log("Changebackground called");
    if (window.scrollY >= 20) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <div className={navbar ? "navbarActive" : "navbar"}>
      <div className={navbar ? "logoActive" : "logo"}>
        <Link to="/" style={{ color: "white" }}>
          {" "}
          <h2>NeetSeat đ</h2>
        </Link>
      </div>
      <div className={navbar ? "navLinksActive" : "navLinks"}>
        {searchFilter && (
          <Input
            type="text"
            placeholder="Search for Events"
            onChange={handleSearchEvent}
          />
        )}
        <button onClick={handleSearchClick}>đ Search</button>
        <Link to="/about">
          <button>âšī¸ About</button>
        </Link>
        <Link to="/contact">
          <button>đ  Contact</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
