import React from "react";
import type { StartPage as StartPageType } from "../../../redux/Quiz/type";
import styles from "./StartPage.module.css";

interface StartPageProps {
  onNext: () => void;
  startPage: StartPageType;
}

const StartPage: React.FC<StartPageProps> = ({ onNext, startPage }) => {
  const { formData, logoImage, backgroundImage } = startPage;

  return (
    <div className={styles.container}>
      {/* Left Image Section */}
      <div className={styles.leftSection} style={{
        backgroundImage: backgroundImage?.file ? `url(${backgroundImage.file})` : "none",
      }}></div>

      {/* Right Content Section */}
      <div className={styles.rightSection}>
        {/* Logo and Slogan */}
        <div className={styles.logoContainer}>
          {logoImage && <img
            src={logoImage.file}
            alt="Caps Agency Logo"
            className={styles.logo}
          />}
          <span className={styles.slogan}>{formData.companySlogan}</span>
        </div>

        {/* Main Text and Button */}
        <div className={styles.mainContent}>
          <h1 className={styles.heading}>{formData.title}</h1>
          <p className={styles.description}>{formData.description}</p>
          <button onClick={onNext} className={styles.button}>
            {formData.buttonText}
          </button>
        </div>

        {/* Footer Section */}
        <div className={styles.footer}>
          <a className={styles.phoneNumber} href="tel:89999999999">{formData.phoneNumber}</a>
          <p className={styles.companyName}>{formData.companyName}</p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
