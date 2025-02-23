import React, { useState } from "react";
import styles from "./ImageUrlQuestion.module.css";

// Типы для ответов
type ImageTextAnswers = {
  text: string;
  file: string;
};

interface ImageSelectionQuestionProps {
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

const ImageUrlQuestion: React.FC<ImageSelectionQuestionProps> = ({
  question,
  answer,
  onAnswer,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(answer?.file || "");

  const handleImageSelect = (selectedImageObj: ImageTextAnswers) => {
    setSelectedImage(selectedImageObj.file);
    onAnswer(selectedImageObj);
  };

  return (
    <div className={styles.container}>
      <h2>{question.question}</h2>
      <div className={styles.gridContainer}>
        {question.answers.map((image) => (
          <div
            key={image.file}
            className={`${styles.card} ${selectedImage === image.file ? styles.selected : ""}`}
            onClick={() => handleImageSelect(image)}
          >
            <img src={image.file} alt={image.text} className={styles.image} />
            <p className={styles.text}>{image.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUrlQuestion;
