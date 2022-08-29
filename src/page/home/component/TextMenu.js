import React from "react";
import { NavLink } from "react-router-dom";
//style
import "../style/home.css";

const TextMenu = ({ menu, activeStyle }) => {
  if (menu.split("/")[1] === "") {
    return (
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{menu.split("/")[0]}
      </span>
    );
  } else {
    return (
      <NavLink
        key={menu.split("/")[1]}
        to={menu.split("/")[1]}
        style={activeStyle}
        className="no-underline"
      >
        <span className="loc-menu-font PL30">{menu.split("/")[0]}</span>
      </NavLink>
    );
  }
};

export default TextMenu;
