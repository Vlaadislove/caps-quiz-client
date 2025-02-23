import React, { useState } from "react";
import styles from "./ImageTextQuestion.module.css";

interface ImageTextAnswers {
  text: string;
  file: string;
}

interface ImageTextQuestionProps {
  question: {
    id: string;
    question: string;
    required: boolean;
    type: string;
    answers: ImageTextAnswers[];
  };
  answer: ImageTextAnswers | null;
  onAnswer: (answer: ImageTextAnswers) => void;
}

const ImageTextQuestion: React.FC<ImageTextQuestionProps> = ({
  question,
  answer,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<ImageTextAnswers | null>(
    answer
  );

  const handleOptionChange = (option: ImageTextAnswers) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.question}>{question.question}</h2>
      <div className={styles.content}>
        {/* Варианты ответа */}
        <ul className={styles.optionList}>
          {question.answers.map((option) => (
            <li
              key={option.text}
              className={selectedOption?.text === option.text ? styles.selected : ""}
            >
              <input
                type="radio"
                id={option.text}
                name={`selector-${question.id}`}
                checked={selectedOption?.text === option.text}
                onChange={() => handleOptionChange(option)}
              />
              <label htmlFor={option.text}>{option.text}</label>
              <div className={styles.check}></div>
            </li>
          ))}
        </ul>

        {/* Блок с изображением */}
        <div className={styles.imageContainer}>
          {selectedOption ? (
            <img
              src={selectedOption.file}
              alt={selectedOption.text}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>Выберите вариант, чтобы увидеть изображение</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageTextQuestion;
