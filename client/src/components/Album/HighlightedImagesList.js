import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import styles from "./styles/HighlightedImagesList.module.sass";

function HighlightedImagesList(props) {
  const [subtitle, setSubtitle] = useState("");
  const [bodyText, setBodyText] = useState("");

  useEffect(() => {
    let article = props.welcomeArticle;
    console.log(props.welcomeArticle.text);
    if (props.welcomeArticle._id.length > 0) {
      setSubtitle(article.text.substr(0, article.text.indexOf(" ")));
      setBodyText(article.text.substr(article.text.indexOf(" ") + 1));
    }
  }, [props.welcomeArticle]);

  return (
    <div className={styles.imagesContainer}>
      {props.isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : (
        <div className={styles.content}>
          <article className={styles.welcomeText}>
            <p>
              <span className={styles.subtitle}>{subtitle}</span>
              <span className={styles.bodyText}>{bodyText}</span>
            </p>
            <p className={styles.sign}>{props.welcomeArticle.sign}</p>
            <p className={styles.origin}>{props.welcomeArticle.origin}</p>
          </article>
          <ul className={styles.list}>
            {props.images.map((image, index) => {
              return (
                <li key={index} className={styles.imageBox}>
                  <div className={styles.imageWrap}>
                    <img src={image.url} alt={image.public_id} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HighlightedImagesList;
