import React, { useState, useEffect } from "react";
import { Spinner, Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import styles from "./styles/Contact.module.sass";
import NewImage from "../NewImage";
import AuthService from "../../services/auth.service";
import ImageSlider from "../Album/ImageSlider";
import { showHeader, showLogo } from "../../actions";

function Contact() {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderImages, setSliderImages] = useState({});
  const _auth = new AuthService();

  useEffect(() => {
    dispatch(showHeader());
    dispatch(showLogo());
  }, []);

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
      alertType: true,
    };
    temp.push(image);
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
    setIsLoading(true);
    let check = true;

    await new Promise((resolve, reject) => {
      check = validateData([...images]);
      resolve(images);
    });
    if (check)
      _auth
        .fetch("/api/send-email", {
          method: "POST",
          body: JSON.stringify({
            contactMail: "marcin123@onet.pl",
            imagesArray: images,
          }),
        })
        .then((json) => {
          setIsLoading(false);
        });
    else setIsLoading(false);
  };

  const validateData = (array) => {
    let check = true;
    for (let index = 0; index < array.length; index++) {
      const image = array[index];
      if (image.year === null || image.year > 2020 || image.year < 1800) {
        image.alertText = "Error! Brak poprawnej daty!";
        image.alertType = false;
        check = false;
      }
      if (image.description === null || image.description.length < 1) {
        image.alertText = "Error! Opis nie może być pusty!";
        image.alertType = false;
        check = false;
      }
      setImages(array);
      return check;
    }
  };

  const setUploadResult = (resultArray) => {
    console.log(resultArray);
    let temp = [...images];
    for (let index = 0; index < temp.length; index++) {
      const image = temp[index];
      let errorInfo = resultArray[index].resultData.errorInfo;
      if (errorInfo.length < 1) {
        image.alertText = "Zdjęcie dodano poprawnie!";
        image.alertType = true;
      } else {
        image.alertText = `Error! ${errorInfo}`;
        image.alertType = false;
      }
    }
    return temp;
  };

  const mailTextChangeHandler = (index) => {
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
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.content}>
        <div className={styles.invitationTextContainer}>
          <div className={styles.invitationText}>
            <p className={styles.title}>Wyślij zdjęcia!</p>
            <p className={styles.subtitle}>
              Prześlij nam zdjęcia i dołóż swoją cegiełkę do upamiętnienia
              naszych okolic!
            </p>
            <p>
              Wszystkie zgloszenia przed dodaniem weryfikowane są przez
              administracje.
            </p>
          </div>
        </div>
        <div className={styles.introductionBox}>
          <Form className={styles.form} onSubmit={imagesUploadHandler}>
            <div className={styles.body}>
              <Form.Group controlId="formEmail" className={styles.formGroup}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">
                      <FontAwesomeIcon
                        className="panel-icon"
                        icon={faEnvelope}
                      />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    className={styles.emailInput}
                    type="email"
                    name="Email"
                    placeholder="Twój adres email do kontaktu"
                    aria-describedby="inputGroupPrepend"
                    onChange={(event) => {
                      mailTextChangeHandler(event);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Niepoprawny format adresu email!
                  </Form.Control.Feedback>
                </InputGroup>
                <Form.Text className="text-muted">
                  Wymagany do ew. weryfikacji zdjęć przed dodaniem do albumu
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formText" className={styles.formGroup}>
                <InputGroup className={styles.input}>
                  <Form.Control
                    as="textarea"
                    name="text"
                    rows="5"
                    placeholder="Wstęp do zgłoszenia lub pytanie, które chcesz zadać. (opcjonalne)"
                    onChange={(event) => {
                      mailTextChangeHandler(event);
                    }}
                  />
                </InputGroup>
              </Form.Group>

              <Button
                className={`${styles.btnSend} button`}
                variant="primary"
                type="submit"
              >
                Wyślij
              </Button>
            </div>
          </Form>
        </div>
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
        {isLoading && (
          <div className={styles.spinner}>
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            ></Spinner>
          </div>
        )}
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
              admin={false}
            />
          );
        })}
      </div>
      <ImageSlider
        show={showSlider}
        onHide={() => {
          setShowSlider(false);
        }}
        images={sliderImages}
        activeIndex={0}
      />
    </div>
  );
}

export default Contact;
