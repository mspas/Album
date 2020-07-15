import React, { useState, useEffect } from "react";
import styles from "./styles/AdminPanel.module.sass";
import { Col, Row } from "react-bootstrap";
import withAuth from "../../services/auth-guard.service";
import AuthService from "../../services/auth.service";
import logo from "../../assets/logo-text.png";
import UploadImages from "./UploadImages";
import ManageImages from "./ManageImages";

function AdminPanel(props) {
  const [optionPanel, setOptionPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHiddenBtn, setIsHiddenBtn] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const _auth = new AuthService();
    setIsLoading(true);
    _auth
      .fetch("/api/get-all-images", {
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
        <Row className={styles.header}>
          <Col
            className={
              optionPanel === true
                ? `${styles.col} ${styles.active}`
                : styles.col
            }
            onClick={() => setOptionPanel(true)}
          >
            Dodaj zdjęcia
          </Col>
          <Col
            className={
              optionPanel === false
                ? `${styles.col} ${styles.active}`
                : styles.col
            }
            onClick={() => setOptionPanel(false)}
          >
            Zarządzaj albumem
          </Col>
        </Row>
        <div className={styles.content}>
          <button
            className={`button ${styles.logout}`}
            onClick={logout}
            style={isHiddenBtn ? weNeedToGoDeeper : {}}
          >
            Wyloguj
          </button>
          {optionPanel && <UploadImages fetchData={fetchData} />}
          {!optionPanel && (
            <ManageImages
              isLoading={isLoading}
              images={images}
              hideLogout={hideLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminPanel);
