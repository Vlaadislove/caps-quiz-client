import React, { ChangeEvent } from "react";
import styles from "./InformationAboutQuiz.module.css";

export interface QuizInfo {
  nameQuiz: string;
  notificationEmail: string;
  personalDataPolicy: string;
  privacyPolicy: string;
}

interface InformationAboutQuizProps {
  quizInfo: QuizInfo;
  setQuizInfo: React.Dispatch<React.SetStateAction<QuizInfo>>;
}


const InformationAboutQuiz: React.FC<InformationAboutQuizProps> = ({quizInfo, setQuizInfo }) => {


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Настройки квиза</h2>
      <div className={styles.formGroup}>
        <label htmlFor="nameQuiz">Название квиза</label>
        <input
          type="text"
          id="nameQuiz"
          name="nameQuiz"
          value={quizInfo.nameQuiz}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="notificationEmail">Email для отправки ответов</label>
        <input
          type="text"
          id="notificationEmail"
          name="notificationEmail"
          value={quizInfo.notificationEmail}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="personalDataPolicy">
          Ссылка на обработку персональных данных
        </label>
        <input
          type="text"
          id="personalDataPolicy"
          name="personalDataPolicy"
          value={quizInfo.personalDataPolicy}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="privacyPolicy">Ссылка на политику конфиденциальности</label>
        <input
          type="text"
          id="privacyPolicy"
          name="privacyPolicy"
          value={quizInfo.privacyPolicy}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default InformationAboutQuiz;
