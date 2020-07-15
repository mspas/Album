import React from "react";
import styles from "./styles/ImageList.module.sass";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function ImageList(props) {
  return (
    <div className={styles.list}>
      {props.isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      ) : (
        <div className={styles.imagesWrap}>
          {props.images.map((image, index) => {
            return (
              <div key={index} className={styles.imageBox}>
                <div className={styles.iconsBox}>
                  <div
                    className={`${styles.iconWrap} center`}
                    onClick={(event) => {
                      props.setModal(event, index);
                      props.hideLogout(true);
                    }}
                  >
                    <FontAwesomeIcon
                      id={`overview-${index}`}
                      className={`panel-icon ${styles.icon}`}
                      icon={faEye}
                    />
                  </div>
                  <div className={`${styles.iconWrap} center`}>
                    <FontAwesomeIcon
                      className={`panel-icon ${styles.icon}`}
                      icon={faEdit}
                    />
                  </div>
                  <div className={`${styles.iconWrap} center`}>
                    <FontAwesomeIcon
                      className={`panel-icon ${styles.icon}`}
                      icon={faTrashAlt}
                    />
                  </div>
                </div>
                <img src={image.url} alt={image.public_id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImageList;