import React, { useState, useEffect } from "react";
import styles from "./styles/AdminPanel.module.sass";
import withAuth from "../../services/auth-guard.service";
import AuthService from "../../services/auth.service";
import logo from "../../assets/logo-text.png";
import UploadImages from "./UploadImages";
import ManageImages from "./ManageImages";
import { useDispatch } from "react-redux";
import { hideHeader, hideLogo } from "../../actions";

function AdminPanel(props) {
  const dispatch = useDispatch();
  const [optionPanel, setOptionPanel] = useState(false);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHiddenBtn, setIsHiddenBtn] = useState(false);

  useEffect(() => {
    fetchData();
    dispatch(hideHeader());
    dispatch(hideLogo());
  }, []);

  const fetchData = () => {
    const _auth = new AuthService();
    setIsLoading(true);
    _auth
      .fetch("/api/admin/get-all-images", {
        method: "GET",
      })
      .then((json) => {
        setImages(json);
        setIsLoading(false);
      });
  };
  const _auth = new AuthService();

  const logout = () => {
    _auth.logout();
    props.history.replace("/login");
  };

  const hideLogout = (check) => {
    setIsHiddenBtn(check);
  };

  const weNeedToGoDeeper = {
    zIndex: "0",
  };

  return (
    <div className={styles.adminPanelWrap}>
      <div className={styles.logoWrap}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.adminPanel}>
        <div className={styles.header}>
          <div
            className={
              optionPanel === true
                ? `${styles.col} ${styles.active}`
                : styles.col
            }
            onClick={() => setOptionPanel(true)}
          >
            Dodaj zdjęcia
          </div>
          <div
            className={
              optionPanel === false
                ? `${styles.col} ${styles.active}`
                : styles.col
            }
            onClick={() => setOptionPanel(false)}
          >
            Zarządzaj albumem
          </div>
        </div>
        <div className={styles.content}>
          <button
            className={`button ${styles.logout}`}
            onClick={logout}
            style={isHiddenBtn ? weNeedToGoDeeper : {}}
          >
            Wyloguj
          </button>
          {optionPanel && (
            <UploadImages hideLogout={hideLogout} fetchData={fetchData} />
          )}
          {!optionPanel && (
            <ManageImages
              isLoading={isLoading}
              images={images}
              hideLogout={hideLogout}
              fetchData={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminPanel);
