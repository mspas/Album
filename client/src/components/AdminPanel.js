import React, { useState } from "react";
import styles from "../styles/AdminPanel.module.sass";
import { Col, Row } from "react-bootstrap";
import withAuth from "../services/auth-guard.service";
import UploadImages from "./UploadImages";
import ManageImages from "./ManageImages";

function AdminPanel() {
  const [optionPanel, setOptionPanel] = useState(true);

  return (
    <div className={styles.adminPanelWrap}>
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
            Zarządaj zdjęciami
          </Col>
        </Row>
        <div className={styles.content}>
          {optionPanel && <UploadImages />}
          {!optionPanel && <ManageImages />}
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminPanel);
