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
  const [modalConfirmText, setModalConfirmText] = useState("");
  const [selectedImage, setSelectedImage] = useState({});
  const [editImage, setEditImage] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [alert, setAlert] = useState({
    imageId: -1,
    alertType: true,
    alertText: true,
  });

  const _auth = new AuthService();

  useEffect(() => {
    const _auth = new AuthService();
    setEmail(_auth.getEmail(_auth.getToken()));
    let array = [];
    for (let i = 0; i < props.images.length; i++) {
      array.push(false);
    }
    setSelectedImages(array);
  }, [props.images]);

  const selectImage = (event, index) => {
    let array = [...selectedImages];
    array[index] = !array[index];
    setSelectedImages(array);
  };

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
    setChangeAdminShow(false);
    setEditShow(false);
    setListShow(true);
  };

  const deleteImage = (event, index) => {
    setModalConfirmText("Czy na pewno usunąć zdjęcie?");
    setModalConfirmShow(true);

    let array = makeItFalse([...selectedImages]);
    array[index] = !array[index];
    setSelectedImages(array);

    deleteImages();
  };

  const makeItFalse = (array) => {
    for (let i = 0; i < array.length; i++) array[i] = false;
    return array;
  };

  const countSelected = () => {
    let count = 0;
    selectedImages.forEach((element) => {
      if (element) count++;
    });
    return count;
  };

  const deleteImages = async () => {
    let selectedIdArray = [];
    setDeleteLoading(true);

    await new Promise((resolve, reject) => {
      for (let i = 0; i < selectedImages.length; i++) {
        const element = selectedImages[i];
        if (!element) continue;
        selectedIdArray.push(props.images[i]._id);
      }
      resolve(selectedIdArray);
    }).then(() => {
      if (selectedIdArray.length > 0)
        _auth
          .fetch("/api/delete-images", {
            method: "POST",
            body: JSON.stringify({
              imagesArray: selectedIdArray,
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
      else setDeleteLoading(false);
    });
  };

  return (
    <div className={styles.manageAlbum}>
      <button
        className={`${styles.btnEmail} button`}
        onClick={() => {
          setListShow(false);
          setChangeAdminShow(true);
        }}
      >
        Zmień dane admina
      </button>
      <button
        className="button"
        onClick={() => {
          setModalConfirmText(
            `Czy na pewno usunąć zaznaczone zdjęcia? (${countSelected()} zaznaczono)`
          );
          setModalConfirmShow(true);
        }}
      >
        Usuń zaznaczone
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
          selectedImages={selectedImages}
          setModal={setModal}
          hideLogout={props.hideLogout}
          setImageEdit={setImageEdit}
          deleteImage={deleteImage}
          selectImage={selectImage}
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
        text={modalConfirmText}
        accept={deleteImages}
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
