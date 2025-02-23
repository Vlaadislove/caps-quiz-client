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
    if (answer) {
      setSelectedAnswers(answer);
    }
  }, [answer]);

  const handleCheckboxChange = (option: string) => {
    setSelectedAnswers((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

  // Синхронизация локального состояния с глобальным через `onAnswer`
  useEffect(() => {
    onAnswer(selectedAnswers);
  }, [selectedAnswers, onAnswer]);

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
