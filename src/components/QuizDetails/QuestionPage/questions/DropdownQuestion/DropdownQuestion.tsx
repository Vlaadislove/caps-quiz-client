import React, { useEffect, useState } from "react";
import styles from "./DropdownQuestion.module.css";

interface DropdownQuestionProps {
  question: {
    id: string;
    question: string;
    required: boolean;
    type: string;
    answers: string[];
  };
  answer: string | null;
  onAnswer: (answer: string) => void;
}

const DropdownQuestion: React.FC<DropdownQuestionProps> = ({
  question,
  answer,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(answer || "");

  useEffect(() => {
    setSelectedOption(answer || '');
  }, [answer]);


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onAnswer(value);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.question}>{question.question}</h2>
      <select
        className={styles.select}
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="" disabled>
          Выберите вариант
        </option>
        {question.answers.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownQuestion;
