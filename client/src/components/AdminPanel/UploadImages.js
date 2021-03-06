import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/UploadImages.module.sass";
import NewImage from "../NewImage";
import AuthService from "../../services/auth.service";
import ImageSlider from "../Album/ImageSlider";

function UploadImages(props) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderImages, setSliderImages] = useState({});
  const _auth = new AuthService();

  const imageSelectedHandler = async (event) => {
    const addImageBase64 = async (fileData) => {
      const file = fileData;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (err) => {
          reject(err);
        };
        reader.readAsDataURL(file);
      });
    };

    let files = event.target.files;
    let temp = [...images];

    for (let i = 0; i < files.length; i++) {
      let image = {
        index: temp.length,
        imageData: await addImageBase64(files[i]),
        description: null,
        year: null,
        isHighlighted: false,
        alertText: null,
        alertType: true,
      };
      temp.push(image);
    }
    setImages(temp);
  };

  const nullifySelector = async (event) => {
    event.target.value = "";
  };

  const descriptionChangeHandler = (event, index) => {
    let temp = [...images];
    let image = { ...temp[index] };
    image.description = event.target.value;
    temp[index] = image;
    setImages(temp);
  };

  const deleteImageHandler = (event, index) => {
    let temp = [...images];
    temp.splice(index, 1);
    setImages(temp);
  };

  const yearChangeHandler = (event, index) => {
    let temp = [...images];
    let image = { ...temp[index] };
    image.year = event.target.value;
    temp[index] = image;
    setImages(temp);
  };

  const highlightChangeHandler = (event, index) => {
    let temp = [...images];
    let image = { ...temp[index] };
    image.isHighlighted = event.target.checked;
    temp[index] = image;
    setImages(temp);
  };

  const imagesUploadHandler = async () => {
    if (images.length < 1) return true;

    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    let check = true;

    await new Promise((resolve, reject) => {
      check = validateData([...images]);
      resolve(images);
    });
    if (check)
      _auth
        .fetch("/api/admin/upload-images", {
          method: "POST",
          body: JSON.stringify({
            imagesArray: images,
          }),
        })
        .then((json) => {
          let temp = setUploadResult(json.resultArray);
          setIsLoading(false);
          setImages(temp);
          props.fetchData();
        });
    else setIsLoading(false);
  };

  const validateData = (array) => {
    let check = true;
    for (let index = 0; index < array.length; index++) {
      const image = array[index];
      if (image.year === null || image.year > 2020 || image.year < 1800) {
        image.alertText = "Błąd! Brak poprawnej daty!";
        image.alertType = false;
        check = false;
      }
      if (image.description === null || image.description.length < 1) {
        image.alertText = "Błąd! Opis nie może być pusty!";
        image.alertType = false;
        check = false;
      }
    }
    setImages(array);
    return check;
  };

  const setUploadResult = (resultArray) => {
    let temp = [...images];
    for (let index = 0; index < temp.length; index++) {
      const image = temp[index];
      let errorInfo = resultArray[index].resultData.errorInfo;
      if (errorInfo.length < 1) {
        image.alertText = "Zdjęcie dodano poprawnie!";
        image.alertType = true;
      } else {
        image.alertText = `Błąd! ${errorInfo}`;
        image.alertType = false;
      }
    }
    return temp;
  };

  const handleShow = (index) => {
    let temp = [...images];
    let image = { ...temp[index] };
    let img = [
      {
        _id: 0,
        public_id: 0,
        url: image.imageData,
        description: image.description,
        year: image.year,
      },
    ];
    setSliderImages(img);
    setShowSlider(true);
    props.hideLogout(true);
  };

  const clearImagesList = () => {
    setImages([]);
  };

  return (
    <div className={styles.uploadImages}>
      <div className={styles.box}>
        <input
          type="file"
          id="inputfile"
          onChange={imageSelectedHandler}
          onClick={nullifySelector}
          multiple
        />
        <label className="button" htmlFor="inputfile">
          <FontAwesomeIcon
            className={`panel-icon ${styles.icon}`}
            icon={faPlus}
          />
          <span>Dodaj zdjęcie...</span>
        </label>
        <button
          className={`button ${styles.btnClear}`}
          onClick={clearImagesList}
        >
          Wyczyść
        </button>
        {isLoading && (
          <div className={styles.spinner}>
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            ></Spinner>
          </div>
        )}
      </div>
      {images.map((image, index) => {
        return (
          <NewImage
            key={index}
            imageURL={image.imageData}
            alertType={image.alertType}
            alertText={image.alertText}
            id={index}
            descriptionChangeHandler={descriptionChangeHandler}
            yearChangeHandler={yearChangeHandler}
            deleteImageHandler={deleteImageHandler}
            highlightChangeHandler={highlightChangeHandler}
            handleShow={handleShow}
            admin={true}
          />
        );
      })}
      <NewImage
        image={null}
        id={-1}
        imageSelectedHandler={imageSelectedHandler}
        nullifySelector={nullifySelector}
        handleShow={handleShow}
        admin={true}
      />
      <ImageSlider
        show={showSlider}
        onHide={() => {
          setShowSlider(false);
          props.hideLogout(false);
        }}
        images={sliderImages}
        activeIndex={0}
        left={[]}
        fetchData={null}
        isPreview={true}
      />
      <button
        className={`button ${styles.btnSend}`}
        onClick={imagesUploadHandler}
      >
        Wyślij
      </button>
    </div>
  );
}

export default UploadImages;
