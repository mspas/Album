import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./styles/Contact.module.sass";
import { showHeader, showLogo } from "../../actions";

function Contact() {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(showHeader());
    dispatch(showLogo());
  }, []);

  const imageSelectedHandler = async (event) => {
    let temp = images;
    let image = {
      imageData: await addImageBase64(event.target.files[0]),
      description: "React description",
      year: "1930",
      isHighlighted: false,
    };
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
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactMail: "marcin123@onet.pl",
        imagesArray: images,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  return (
    <div>
      siema Contact
      <input type="file" onChange={imageSelectedHandler} />
      <input type="file" onChange={imageSelectedHandler} />
      <button onClick={imagesUploadHandler}>Send</button>
    </div>
  );
}

export default Contact;
