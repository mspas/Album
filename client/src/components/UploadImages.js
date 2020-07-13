import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/UploadImages.module.sass";
import NewImage from "./NewImage";
import AuthService from "../services/auth.service";

function UploadImages() {
  const [images, setImages] = useState([]);
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

    let temp = [...images];
    let image = {
      index: temp.length,
      imageData: await addImageBase64(event.target.files[0]),
      description: null,
      year: null,
      isHighlighted: false,
      alertText: null,
    };
    temp.push(image);
    setImages(temp);
  };

  const nullifySelector = async (event) => {
    event.target.value = "";
  };

  const descriptionChangeHandler = (event) => {
    let id = event.target.id.split("-")[1];
    let index = parseInt(id);
    let temp = [...images];
    let image = { ...temp[index] };
    image.description = event.target.value;
    temp[index] = image;
    setImages(temp);
  };

  const deleteImageHandler = (event) => {
    let id = event.target.id.split("-")[1];
    let index = parseInt(id);
    let temp = [...images];
    temp.splice(index, 1);
    setImages(temp);
  };

  const yearChangeHandler = (event) => {
    let id = event.target.id.split("-")[1];
    let index = parseInt(id);
    let temp = [...images];
    let image = { ...temp[index] };
    image.year = event.target.value;
    temp[index] = image;
    setImages(temp);
  };

  const highlightChangeHandler = (event) => {
    let id = event.target.id.split("-")[1];
    let index = parseInt(id);
    let temp = [...images];
    let image = { ...temp[index] };
    image.isHighlighted = event.target.value;
    temp[index] = image;
    setImages(temp);
  };

  const imagesUploadHandler = async () => {
    let check = true;

    await new Promise((resolve, reject) => {
      let temp = [...images];
      for (let index = 0; index < temp.length; index++) {
        const image = temp[index];
        if (image.year === null || image.year > 2020 || image.year < 1800) {
          image.alertText = "Error! Brak poprawnej daty!";
          check = false;
        }
        if (image.description === null || image.description.length < 1) {
          image.alertText = "Error! Opis nie może być pusty!";
          check = false;
        }
        setImages(temp);
      }
      resolve(images);
    });
    if (check)
      _auth
        .fetch("/api/upload-images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagesArray: images,
          }),
        })
        .then((json) => {
          console.log(json);
        });
  };

  return (
    <div className={styles.uploadImages}>
      <div className={styles.box}>
        <input
          type="file"
          id="inputfile"
          onChange={imageSelectedHandler}
          onClick={nullifySelector}
        />
        <label className="button" htmlFor="inputfile">
          <FontAwesomeIcon
            className={`panel-icon ${styles.icon}`}
            icon={faPlus}
          />
          <span>Dodaj zdjęcie...</span>
        </label>
      </div>
      {images.map((image, index) => {
        return (
          <NewImage
            key={index}
            image={image}
            alert={image.alertText}
            id={index}
            descriptionChangeHandler={descriptionChangeHandler}
            yearChangeHandler={yearChangeHandler}
            deleteImageHandler={deleteImageHandler}
            highlightChangeHandler={highlightChangeHandler}
          />
        );
      })}
      <NewImage
        image={null}
        id={-1}
        imageSelectedHandler={imageSelectedHandler}
        nullifySelector={nullifySelector}
      />
      <button className="button" onClick={imagesUploadHandler}>
        Wyślij
      </button>
    </div>
  );
}

export default UploadImages;
