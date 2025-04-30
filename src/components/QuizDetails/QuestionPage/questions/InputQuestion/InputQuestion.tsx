import React, { useState, useEffect } from 'react';
import styles from './InputQuestion.module.css';


interface InputField {
  placeholder: string;
}

interface InputQuestionProps {
  question: {
    id: string;
    question: string;
    required: boolean;
    type: string;
    answers: InputField[];
  };
  answer: Record<string, string> | null;
  onAnswer: (answer: Record<string, string>) => void;
}
const InputQuestion: React.FC<InputQuestionProps> = ({ question, answer, onAnswer }) => {

  const [inputValues, setInputValues] = useState<Record<string, string>>({});


  useEffect(() => {
    if (answer) {
      setInputValues(answer);
    } else {
      const initialState: Record<string, string> = {};
      question.answers.forEach((field) => {
        if ('placeholder' in field) {
          initialState[field.placeholder] = '';
        }
      });
      setInputValues(initialState);
    }
  }, [answer, question.answers]);

  const handleChange = (key: string, value: string) => {
    const updated = { ...inputValues, [key]: value };
    setInputValues(updated);
    onAnswer(updated);
  };

  return (
    <div>
      <h2>{question.question}</h2>
      <form>
        <div className={styles.container}>
          {question.answers.map((field) => {
            const key = field.placeholder;
            return (
              <div className={styles.inputWrapper} key={key}>
                <label htmlFor={key}>
                  <input
                    id={key}
                    className={styles.inputText}
                    type="text"
                    value={inputValues[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default InputQuestion;