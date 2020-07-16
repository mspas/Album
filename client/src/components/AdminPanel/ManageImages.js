import React, { useState } from "react";
import styles from "./styles/ManageImages.module.sass";
import ImageModal from "./ImageModal";
import ImageList from "./ImageList";
import EditImage from "./EditImage";

function ManageImages(props) {
  const [editShow, setEditShow] = useState(false);
  const [listShow, setListShow] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const [editImage, setEditImage] = useState({});

  const setModal = (event, index) => {
    setSelectedImage(props.images[index]);
    setModalShow(true);
  };

  const setImageEdit = (event, index) => {
    setEditImage(props.images[index]);
    setEditShow(true);
    setListShow(false);
  };

  const onBack = () => {
    setEditShow(false);
    setListShow(true);
  };

  return (
    <div className={styles.manageAlbum}>
      <button className={`${styles.btnEmail} button`}>
        Zmień adres e-mail
      </button>
      {listShow && (
        <ImageList
          isLoading={props.isLoading}
          images={props.images}
          setModal={setModal}
          hideLogout={props.hideLogout}
          setImageEdit={setImageEdit}
        />
      )}
      {editShow && (
        <EditImage
          isLoading={props.isLoading}
          image={editImage}
          onBack={onBack}
        />
      )}
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
