import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.sass";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";

const Header = (props) => {
  const showHeader = useSelector((state) => state.showHeader);
  const showLogo = useSelector((state) => state.showLogo);
  const [headerClass, setHeaderClass] = useState("");
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    let c = props.sticky ? styles.headerSticky : styles.header;
    if (headerClass !== "") {
      if (!showHeader && !props.sticky) c += " " + styles.transparentBg + " ";
      if (!showLogo) c += styles.hideBehind;
    }
    setHeaderClass(c);
  }, [showHeader, showLogo, props.sticky]);

  return (
    <header className={headerClass}>
      {!props.sticky && (
        <NavLink to="/home">
          <img src={logo} alt="Logo" />
        </NavLink>
      )}
      {(showHeader || props.sticky) && (
        <span className={styles.cityTitle}>Paradyż</span>
      )}
      {(showHeader || props.sticky) && (
        <ul className={styles.menu}>
          <li>
            <NavLink
              className={
                showHeader ? styles.link : `${styles.link} ${styles.hideBehind}`
              }
              to="/album"
            >
              <span>Przglądaj album</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={
                showHeader ? styles.link : `${styles.link} ${styles.hideBehind}`
              }
              to="/kontakt"
            >
              <span>Prześlij zdjęcia</span>
            </NavLink>
          </li>
        </ul>
      )}
      {(showHeader || props.sticky) && (
        <button
          className={`${styles.mobileNavBtn} button`}
          onClick={() => {
            setShowMobileNav(!showMobileNav);
          }}
        >
          <FontAwesomeIcon icon={showMobileNav ? faTimes : faBars} />
        </button>
      )}
      {showMobileNav && (
        <div
          className={
            showHeader || props.sticky
              ? `${styles.visible} ${styles.mobileNav}`
              : `${styles.hidden} ${styles.mobileNav}`
          }
        >
          <ul>
            <li>
              <NavLink className={styles.mobileLink} to="/album">
                <span>Przglądaj album</span>
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.mobileLink} to="/kontakt">
                <span>Prześlij zdjęcia</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
