import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import styles from "./Header.module.sass";
import logo from "../assets/logo.png";

const Header = (props) => {
  return (
    <header className="header">
      <NavLink to="/home">
        <img
          src={logo}
          alt="Logo"
          className={props.showLogo ? styles.visible : styles.hidden}
        />
      </NavLink>
      <ul className={props.showBtns ? styles.visible : styles.hidden}>
        <li>
          <NavLink className={styles.link} to="/album">
            <span>Przglądaj album</span>
          </NavLink>
        </li>
        <li>
          <NavLink className={styles.link} to="/kontakt">
            <span>Prześlij zdjęcia</span>
          </NavLink>
        </li>
      </ul>
    </header>
  );
};

export default withRouter(Header);
