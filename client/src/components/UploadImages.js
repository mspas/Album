import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/UploadImages.module.sass";
import NewImage from "./NewImage";

function UploadImages() {
  const [images, setImages] = useState([]);

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
      imageData: await addImageBase64(event.target.files[0]),
      description: "",
      year: 0,
      isHighlighted: false,
    };
    temp.push(image);
    setImages(temp);
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

  const imagesUploadHandler = () => {
    fetch("/api/upload-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imagesArray: images,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  return (
    <div className={styles.uploadImages}>
      <div className={styles.box}>
        <input type="file" id="inputfile" onChange={imageSelectedHandler} />
        <label htmlFor="inputfile">
          <FontAwesomeIcon
            className={`panel-icon ${styles.icon}`}
            icon={faUpload}
          />
          <span>Dodaj zdjęcie...</span>
        </label>
      </div>
      {images.map((image, index) => {
        return (
          <NewImage
            key={index}
            image={image}
            id={index}
            descriptionChangeHandler={descriptionChangeHandler}
            yearChangeHandler={yearChangeHandler}
            deleteImageHandler={deleteImageHandler}
            highlightChangeHandler={highlightChangeHandler}
          />
        );
      })}
      <button onClick={imagesUploadHandler}>Wyślij</button>
    </div>
  );
}

export default UploadImages;
