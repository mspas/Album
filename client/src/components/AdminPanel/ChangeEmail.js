import React from "react";
import styles from "./styles/Form.module.sass";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ChangeEmail = (props) => {
  return (
    <Form className={styles.form} onSubmit={props.onSubmit}>
      <div className={styles.header}>
        <p className={styles.info}>
          Album Paradyż - zmiana adresu email administratora (obecnie:{" "}
          <span>{props.email}</span>)
        </p>
        <p className={styles.info}>
          Na ten adres przychodzą zgloszenia użytkowników z nowymi zdjęciami!
        </p>
      </div>
      <div className={styles.body}>
        <Form.Group controlId="formEmail">
          <InputGroup className={styles.input}>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <FontAwesomeIcon className="panel-icon" icon={faEnvelope} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="email"
              name="Email"
              placeholder="Nowy email"
              aria-describedby="inputGroupPrepend"
              onChange={props.onChangeEmail}
              required
            />
            <Form.Control.Feedback type="invalid">
              Niepoprawny format adresu email!
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <InputGroup className={styles.input}>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <FontAwesomeIcon className="panel-icon" icon={faLock} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="password"
              name="Password"
              placeholder="Wpsiz hasło"
              aria-describedby="inputGroupPrepend"
              onChange={props.onChangePassword}
              required
            />
            <Form.Control.Feedback type="invalid">
              Wpisz hasło dla potwierdzenia zmian.
            </Form.Control.Feedback>
          </InputGroup>
          <Form.Text className="text-muted">
            Zmianę adresu email potwierdź podając hasło admina.
          </Form.Text>
        </Form.Group>

        <Button className="button" variant="primary" type="submit">
          Wyślij
        </Button>
      </div>
    </Form>
  );
};
export default ChangeEmail;
