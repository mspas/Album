import React, { useState, useEffect } from "react";
import { Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileAlt,
  faPenFancy,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/auth.service";
import styles from "./styles/EditWelcomeText.module.sass";
import Alert from "../Alert";

function EditWelcomeText(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    alertType: false,
    alertText: "",
  });
  const [showError, setShowError] = useState(false);
  const [text, setText] = useState("");
  const [sign, setSign] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setText(props.welcomeArticle.text);
    setSign(props.welcomeArticle.sign);
    setOrigin(props.welcomeArticle.origin);
  }, [props.welcomeArticle]);

  const onSubmit = (event) => {
    event.preventDefault();
    const _auth = new AuthService();

    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    _auth
      .fetch("/api/edit-welcome-article", {
        method: "PATCH",
        body: JSON.stringify({
          _id: props.welcomeArticle._id,
          text: text,
          sign: sign,
          origin: origin,
        }),
      })
      .then((json) => {
        console.log(json);
        setIsLoading(false);
        setError({
          alertType: json.result,
          alertText: json.errorInfo,
        });
        setShowError(true);
      });
  };

  return (
    <div className={styles.panelDetails}>
      <Button
        variant="light"
        onClick={props.onBack}
        className={`${styles.button} button center`}
      >
        <FontAwesomeIcon
          className={`${styles.backIcon} panel-icon`}
          icon={faArrowLeft}
        />
        <span>Wstecz</span>
      </Button>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
      )}
      <Alert show={showError} type={error.alertType} text={error.alertText} />
      <Form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.body}>
          <Form.Group controlId="formText">
            <InputGroup className={styles.input}>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <FontAwesomeIcon className="panel-icon" icon={faFileAlt} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                as="textarea"
                rows="5"
                name="Tekst"
                defaultValue={
                  props.welcomeArticle ? props.welcomeArticle.text : ""
                }
                onChange={(event) => {
                  setText(event.target.value);
                }}
                aria-describedby="inputGroupPrepend"
                required
              />
            </InputGroup>
            <Form.Text className="text-muted">
              Tekst powitania. Pierwsze słowo zostanie automatycznie wyróżnione
              w panelu na stronie głównej.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formSign">
            <InputGroup className={styles.input}>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <FontAwesomeIcon className="panel-icon" icon={faPenFancy} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="Sign"
                defaultValue={
                  props.welcomeArticle ? props.welcomeArticle.sign : ""
                }
                onChange={(event) => {
                  setSign(event.target.value);
                }}
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Wpisz hasło dla potwierdzenia zmian.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">Podpis osoby.</Form.Text>
          </Form.Group>

          <Form.Group controlId="formOrigin">
            <InputGroup className={styles.input}>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <FontAwesomeIcon className="panel-icon" icon={faBuilding} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="Origin"
                defaultValue={
                  props.welcomeArticle ? props.welcomeArticle.origin : ""
                }
                onChange={(event) => {
                  setOrigin(event.target.value);
                }}
                aria-describedby="inputGroupPrepend"
              />
            </InputGroup>
            <Form.Text className="text-muted">
              Instytucja, którą reprezentuje osoba podpisana. (opcjonalne)
            </Form.Text>
          </Form.Group>

          <Button className="button" variant="primary" type="submit">
            Wyślij
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default EditWelcomeText;
