import React, { useState, useEffect } from "react";
import { Spinner, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import styles from "./styles/Contact.module.sass";
import NewImage from "../NewImage";
import AuthService from "../../services/auth.service";
import { showHeader, showLogo } from "../../actions";

function Contact() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [mailText, setMailText] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState({ type: true, message: "" });

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

  const imagesSendHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    let check = true;
    if (mailText.length < 1) {
      check = false;
      setError({
        type: false,
        message:
          "Jeśli nie wysyłasz zdjęć, pole wiadomości nie może być puste.",
      });
    }

    await new Promise((resolve, reject) => {
      if (images.length > 0) check = validateData([...images]);
      resolve(check);
    }).then(() => {
      if (check)
        _auth
          .fetch("/api/send-email", {
            method: "POST",
            body: JSON.stringify({
              contactMail: email,
              mailText: mailText,
              imagesArray: images,
            }),
          })
          .then((json) => {
            setIsLoading(false);
            setError({ type: json.success, message: json.message });
            setShowError(true);
          });
      else {
        if (mailText.length < 1) {
          if (images.length > 0)
            setError({
              type: false,
              message: "Zgłoszenie nie zostało wysłane! Popraw błędy!",
            });
          setShowError(true);
        }
        setIsLoading(false);
      }
    });
  };

  const validateData = (array) => {
    let check = true;
    for (let index = 0; index < array.length; index++) {
      const image = array[index];
      if (image.year === null || image.year > 2020 || image.year < 1850) {
        image.alertText = "Error! Brak poprawnej daty spomiędzy lat 1850-2020!";
        image.alertType = false;
        check = false;
      }
      if (image.description === null || image.description.length < 1) {
        image.alertText = "Error! Opis nie może być pusty!";
        image.alertType = false;
        check = false;
      }
    }
    setImages(array);
    return check;
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.invitationTextContainer}>
        <div className={styles.invitationText}>
          <p className={styles.title}>Wyślij zdjęcia!</p>
          <p className={styles.subtitle}>
            Prześlij nam zdjęcia i dołóż swoją cegiełkę do upamiętnienia naszych
            okolic!
          </p>
          <p>
            Wszystkie zgloszenia przed dodaniem weryfikowane są przez
            administracje.
          </p>
        </div>
      </div>
      <div className={styles.content}>
        {showError && (
          <div className={styles.alertBox}>
            <p
              className={
                error.type
                  ? `${styles.alert} ${styles.success}`
                  : `${styles.alert} ${styles.error}`
              }
            >
              {error.message}
            </p>
          </div>
        )}
        <div className={styles.introductionBox}>
          <Form className={styles.form} onSubmit={imagesSendHandler}>
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
                      setEmail(event.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Niepoprawny format adresu email!
                  </Form.Control.Feedback>
                </InputGroup>
                <Form.Text className="text-muted">
                  Email wymagany do ew. weryfikacji zdjęć przed dodaniem do
                  albumu
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
                      setMailText(event.target.value);
                    }}
                  />
                </InputGroup>
              </Form.Group>

              <button
                className={`${styles.btnSend} button`}
                variant="primary"
                type="submit"
              >
                Wyślij
              </button>
            </div>
          </Form>
        </div>
        <input
          type="file"
          id="inputfile"
          className={styles.inputFile}
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
        <div className={styles.imagesListContainer}>
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
      </div>
    </div>
  );
}

export default Contact;
