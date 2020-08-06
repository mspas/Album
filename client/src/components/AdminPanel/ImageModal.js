import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/ImageModal.module.sass";

const ImageOverviewModal = (props) => {
  return (
    <div>
      {props.show && (
        <div className={`${styles.modal} center`}>
          <div className={styles.overlay} onClick={props.onHide}></div>
          <div className={styles.content}>
            <div className={styles.heading}>
              <Button className={styles.btnClose}>
                <FontAwesomeIcon
                  className={`${styles.closeIcon} panel-icon`}
                  icon={faTimes}
                  onClick={props.onHide}
                />
              </Button>
            </div>
            <div className={styles.body}>
              <img src={props.image_url} alt={props.public_id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageOverviewModal;
