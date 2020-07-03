import React, { useState } from "react";

import "../styles/AdminPanel.sass";

function AdminPanel() {
  const [images, setImages] = useState([]);

  const imageSelectedHandler = async (event) => {
    let temp = images;
    let image = await addImageBase64(event.target.files[0]);
    temp.push(image);
    setImages(temp);
  };

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

  const imagesUploadHandler = () => {
    fetch("/api/upload-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imagesArray: images,
      }),
    });
  };

  return (
    <div className="App">
      siema AdminPanel
      <input type="file" onChange={imageSelectedHandler} />
      <input type="file" onChange={imageSelectedHandler} />
      <button onClick={imagesUploadHandler}>Upload</button>
    </div>
  );
}

export default AdminPanel;
