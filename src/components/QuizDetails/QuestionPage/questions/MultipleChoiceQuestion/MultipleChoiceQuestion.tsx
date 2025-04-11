import React, { useState, useEffect } from "react";
import styles from "./MultipleChoiceQuestion.module.css";



interface MultipleChoiceQuestionProps {
  question: {
    id: string;
    question: string;
    answers: string[];
    required: boolean;
  };
  answer: string[] | null;
  onAnswer: (answer: string[]) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  answer,
  onAnswer,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(answer || []);

  useEffect(() => {
    if (Array.isArray(answer)) {
      setSelectedAnswers(answer);
    } else {
      setSelectedAnswers([]);
    }
  }, [answer]);

  const handleCheckboxChange = (option: string) => {
    setSelectedAnswers((prevSelected) => {
      const newSelected = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];

      onAnswer(newSelected);
      return newSelected;
    });
  };



  console.log(selectedAnswers)
  return (
    <div>
      <h2>{question.question}</h2>
      <ul className={styles.optionList}>
        {question.answers.map((option) => (
          <li
            key={option}
            className={selectedAnswers.includes(option) ? styles.selected : ""}
          >
            <input
              type="checkbox"
              id={option}
              name={`selector-${question.id}`}
              checked={selectedAnswers.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            <label htmlFor={option}>{option}</label>
            <div className={styles.check}></div>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default MultipleChoiceQuestion;
