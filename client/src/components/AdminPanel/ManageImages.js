import React, { useState } from "react";
import styles from "./styles/ManageImages.module.sass";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "./ImageModal";

function ManageImages(props) {
  const [modalShow, setModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});

  const setModal = (event, index) => {
    setSelectedImage(props.images[index]);
    setModalShow(true);
  };

  return (
    <div className={styles.manageAlbum}>
      <button className={`${styles.btnEmail} button`}>
        Zmień adres e-mail
      </button>
      {props.isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      )}
      <div className={styles.imagesWrap}>
        {props.images.map((image, index) => {
          return (
            <div key={index} className={styles.imageBox}>
              <div className={styles.iconsBox}>
                <div
                  className={`${styles.iconWrap} center`}
                  onClick={(event) => {
                    setModal(event, index);
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
        <ImageModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
          image_url={selectedImage.url}
          public_id={selectedImage.public_id}
          description={selectedImage.description}
          year={selectedImage.year}
        />
      </div>
    </div>
  );
}

export default ManageImages;
