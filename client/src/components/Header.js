import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.sass";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";

const Header = () => {
  const showHeader = useSelector((state) => state.showHeader);
  const showLogo = useSelector((state) => state.showLogo);
  const [headerClass, setHeaderClass] = useState("header ");

  useEffect(() => {
    let c = "header ";
    if (!showHeader) c += styles.transparentBg + " ";
    if (!showLogo) c += styles.hideBehind;
    setHeaderClass(c);
  }, [showHeader, showLogo]);

  return (
    <header className={headerClass}>
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
