import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.sass";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";

const Header = (props) => {
  const showHeader = useSelector((state) => state.showHeader);

  return (
    <header
      className={showHeader ? "header" : `header ${styles.transparentBg}`}
    >
      <NavLink to="/home">
        <img src={logo} alt="Logo" />
      </NavLink>
      <ul className={showHeader ? styles.visible : styles.hidden}>
        <li>
          <NavLink className={showHeader ? styles.link : ""} to="/album">
            <span>Przglądaj album</span>
          </NavLink>
        </li>
        <li>
          <NavLink className={showHeader ? styles.link : ""} to="/kontakt">
            <span>Prześlij zdjęcia</span>
          </NavLink>
        </li>
      </ul>
    </header>
  );
};

export default Header;
