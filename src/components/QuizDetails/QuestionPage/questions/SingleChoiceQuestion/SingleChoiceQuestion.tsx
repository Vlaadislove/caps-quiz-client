import React, { useState, useEffect } from "react";
import styles from "./SingleChoiceQuestion.module.css";

interface SingleChoiceQuestionProps {
  question: {
    id: string;
    question: string;
    answers: string[];
    required: boolean;
  };
  answer: string | null;
  onAnswer: (answer: string) => void;
  onNext: () => void;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  question,
  answer,
  onAnswer,
  onNext,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(answer);

  useEffect(() => {
    setSelectedAnswer(answer);
  }, [answer, question.id]);

  const handleOptionChange = (option: string) => {
    setSelectedAnswer(option);
    onAnswer(option);
  };

  return (
    <div>
      <h2>{question.question}</h2>
      <ul className={styles.optionList}>
        {question.answers.map((option) => (
          <li
            key={option}
            className={selectedAnswer === option ? styles.selected : ""}
          >
            <input
              type="radio"
              id={option}
              name={`selector-${question.id}`}
              checked={selectedAnswer === option}
              onChange={() => handleOptionChange(option)}
              onClick={onNext}
            />
            <label htmlFor={option}>{option}</label>
            <div className={styles.check}></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SingleChoiceQuestion;
