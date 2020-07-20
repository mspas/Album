import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import styles from "./styles/ManageImages.module.sass";
import ImageModal from "./ImageModal";
import ConfirmModal from "../ConfirmModal";
import ImageList from "./ImageList";
import EditImage from "./EditImage";
import AuthService from "../../services/auth.service";
import ChangeAdminDetails from "./ChangeAdminDetails";

function ManageImages(props) {
  const [editShow, setEditShow] = useState(false);
  const [listShow, setListShow] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [changeAdminShow, setChangeAdminShow] = useState(false);
  const [modalConfirmShow, setModalConfirmShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const [editImage, setEditImage] = useState({});
  const [deleteImagesId, setDeleteImagesId] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({
    imageId: -1,
    alertType: true,
    alertText: true,
  });

  const _auth = new AuthService();

  useEffect(() => {
    setEmail(_auth.getEmail(_auth.getToken()));
  }, []);

  const setModal = (event, index) => {
    setSelectedImage(props.images[index]);
    setModalShow(true);
  };

  const setImageEdit = (event, index) => {
    setEditImage(props.images[index]);
    setEditShow(true);
    setListShow(false);
  };

  const onChangeDetails = (event) => {
    setListShow(false);
    setChangeAdminShow(true);
  };

  const onDeleteImage = (event, index) => {
    setModalConfirmShow(true);
    setDeleteImagesId([index]);
  };

  const onBack = () => {
    setChangeAdminShow(false);
    setEditShow(false);
    setListShow(true);
  };

  const deleteImage = () => {
    let array = [];
    array.push(deleteImagesId[0]);
    setDeleteImagesId(array);
    deleteImages(array);
  };

  const deleteImages = async (array) => {
    let deleteArray = deleteImagesId;

    if (array && array.length > 0) deleteArray = array;

    if (deleteArray.length > 0) {
      let images = [];
      setDeleteLoading(true);

      await new Promise((resolve, reject) => {
        deleteArray.forEach((id) => {
          images.push(props.images[id]._id);
          console.log(props.images[id], id);
        });
        resolve(images);
      });
      _auth
        .fetch("/api/delete-images", {
          method: "POST",
          body: JSON.stringify({
            imagesArray: images,
          }),
        })
        .then((json) => {
          let id = -1;
          if (!json.result[0].success) id = json.result[0].id;
          setAlert({
            imageId: id,
            alertType: json.result[0].success,
            alertText: json.result[0].errorInfo,
          });
          setDeleteLoading(false);
          if (json.result[0].success) {
            setModalConfirmShow(false);
            props.fetchData();
          }
        });
    } else setDeleteLoading(false);
  };

  return (
    <div className={styles.manageAlbum}>
      <button className={`${styles.btnEmail} button`} onClick={onChangeDetails}>
        Zmień dane admina
      </button>
      {deleteLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      )}
      {listShow && (
        <ImageList
          isLoading={props.isLoading}
          images={props.images}
          setModal={setModal}
          hideLogout={props.hideLogout}
          setImageEdit={setImageEdit}
          onDeleteImage={onDeleteImage}
        />
      )}
      {editShow && (
        <EditImage
          isLoading={props.isLoading}
          image={editImage}
          onBack={onBack}
        />
      )}
      {changeAdminShow && <ChangeAdminDetails email={email} onBack={onBack} />}
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
      <ConfirmModal
        show={modalConfirmShow}
        text="Czy na pewno usunąć zdjęcie?"
        accept={deleteImage}
        onHide={() => {
          setModalConfirmShow(false);
        }}
        alertText={alert.alertText}
        alertType={alert.alertType}
      />
    </div>
  );
}

export default ManageImages;
