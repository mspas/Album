import React, { useState } from "react";
import styles from "./styles/ManageImages.module.sass";
import ImageModal from "./ImageModal";
import ImageList from "./ImageList";

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
      <ImageList
        isLoading={props.isLoading}
        images={props.images}
        setModal={setModal}
        hideLogout={props.hideLogout}
      />
      <ImageModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          props.hideLogout(false);
        }}
        image_url={selectedImage.url}
        public_id={selectedImage.public_id}
        description={selectedImage.description}
        year={selectedImage.year}
      />
    </div>
  );
}

export default ManageImages;
