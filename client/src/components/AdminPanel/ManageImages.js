import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import styles from "./styles/ManageImages.module.sass";
import ImageModal from "./ImageModal";
import ConfirmModal from "../ConfirmModal";
import ImageList from "./ImageList";
import EditImage from "./EditImage";
import AuthService from "../../services/auth.service";
import ChangeAdminDetails from "./ChangeAdminDetails";
import EditWelcomeText from "./EditWelcomeText";

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
    alertText: "",
  });
  const [welcomeArticle, setWelcomeArticle] = useState({
    _id: "",
  });
  const [changeWelcomeTextShow, setChangeWelcomeTextShow] = useState(false);
  const [selectAllOption, setSelectAllOption] = useState(true);
  const [selectAllText, setSelectAllText] = useState("Zaznacz");

  const _auth = new AuthService();

  useEffect(() => {
    const _auth = new AuthService();

    _auth
      .fetch("/api/get-welcome-article", {
        method: "GET",
      })
      .then((json) => {
        setWelcomeArticle(json);
      });

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

  const selectAllImages = () => {
    let text = selectAllOption ? "Odznacz" : "Zaznacz";
    let array = selectedImages.map(() => {
      return selectAllOption;
    });

    setSelectAllText(text);
    setSelectedImages(array);
    setSelectAllOption(!selectAllOption);
  };

  const setModal = (event, index) => {
    setSelectedImage(props.images[index]);
    setModalShow(true);
  };

  const setImageEdit = (event, index) => {
    setSelectedImages([]);
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

  const handleDeleteImages = () => {
    if (listShow) {
      setModalConfirmText(
        `Czy na pewno usunąć zaznaczone zdjęcia? (${countSelected()} zaznaczono)`
      );
      setModalConfirmShow(true);
      if (countSelected() < 1)
        setAlert({
          imageId: -1,
          alertType: false,
          alertText: "Nie zaznaczono żadnego zdjęcia!",
        });
      else
        setAlert({
          imageId: -1,
          alertType: true,
          alertText: "",
        });
    }
  };

  const deleteImages = async () => {
    let selectedIdArray = [];
    setDeleteLoading(true);

    if (listShow)
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
            .fetch("/api/admin/delete-images", {
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
          setChangeWelcomeTextShow(false);
        }}
      >
        Zmień dane admina
      </button>
      <button
        className={`${styles.btnEmail} button`}
        onClick={() => {
          setListShow(false);
          setChangeAdminShow(false);
          setEditImage({});
          setEditShow(false);
          setChangeWelcomeTextShow(true);
        }}
      >
        Zmień wstępny tekst
      </button>
      <button className="button" onClick={handleDeleteImages}>
        Usuń zaznaczone
      </button>
      <button className="button" onClick={selectAllImages}>
        {selectAllText} wszystkie
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
          hideLogout={props.hideLogout}
        />
      )}
      {changeAdminShow && <ChangeAdminDetails email={email} onBack={onBack} />}
      {changeWelcomeTextShow && (
        <EditWelcomeText welcomeArticle={welcomeArticle} onBack={onBack} />
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
