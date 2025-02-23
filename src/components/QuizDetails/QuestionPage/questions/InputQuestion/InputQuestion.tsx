import React, { useState, useEffect } from 'react';
import styles from './InputQuestion.module.css';


interface InputQuestionProps {
  question: {
    id: string;
    question: string;
    required: boolean;
    type: string;
  };
answer: string | null;
  onAnswer: (answer: string) => void;
}

const InputQuestion: React.FC<InputQuestionProps> = ({ question, answer, onAnswer }) => {
  const [inputValue, setInputValue] = useState<string>(typeof answer === 'string' ? answer : '');


  // Обновление состояния при изменении ввода
  useEffect(() => {
    onAnswer(inputValue);
  }, [inputValue, onAnswer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <h2>{question.question}</h2>
      <form>
        <div className={styles.container}>
          <label htmlFor={question.id}>
            <input
              id={question.id}
              className={styles.inputText}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              required={question.required}
              placeholder="Введите ваш ответ"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default InputQuestion;