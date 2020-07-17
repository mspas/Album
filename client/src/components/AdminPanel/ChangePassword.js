import React from "react";
import styles from "./styles/Form.module.sass";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = (props) => {
  return (
    <Form className={styles.form} onSubmit={props.onSubmit}>
      <div className={styles.header}>
        <p className={styles.info}>
          Album Paradyż - zmiana hasła administratora
        </p>
      </div>
      <div className={styles.body}>
        <Form.Group controlId="formEmail">
          <InputGroup className={styles.input}>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <FontAwesomeIcon className="panel-icon" icon={faLock} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="password"
              name="oldPassword"
              placeholder="Obecne hasło"
              aria-describedby="inputGroupPrepend"
              onChange={props.onChangePassword}
              required
            />
            <Form.Control.Feedback type="invalid">
              Wpisz obecne hasło
            </Form.Control.Feedback>
          </InputGroup>
          <Form.Text className="text-muted">
            Zmianę hasła potwierdź podając obecne hasło admina.
          </Form.Text>
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
              name="newPassword"
              placeholder="Nowe hasło"
              aria-describedby="inputGroupPrepend"
              onChange={props.onChangeNewPassword}
              required
            />
            <Form.Control.Feedback type="invalid">
              Wpisz nowe hasło
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
              name="newPassword"
              placeholder="Potwierdź nowe hasło"
              aria-describedby="inputGroupPrepend"
              onChange={props.onChangeNewPasswordConfirmation}
              required
            />
            <Form.Control.Feedback type="invalid">
              Wpisz nowe hasło ponownie
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Button className="button" variant="primary" type="submit">
          Wyślij
        </Button>
      </div>
    </Form>
  );
};
export default ChangePassword;
