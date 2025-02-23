import React, { useState } from 'react';

interface CalendarQuestionProps {
  question: {
    id: string;
    question: string;
    required: boolean;
    type: string;
  };
  answer: string | null;
  onAnswer: (date: string) => void;
}

const CalendarQuestion: React.FC<CalendarQuestionProps> = ({ question, answer, onAnswer }) => {
  const [selectedDate, setSelectedDate] = useState<string>(answer || '');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    onAnswer(date); // Сохраняем дату в формате ISO (yyyy-MM-dd)
  };

  return (
    <div>
      <h2>{question.question}</h2>
      <input
        type="date"
        id={question.id}
        value={selectedDate}
        onChange={handleDateChange}
        placeholder="Выберите дату"
        style={{
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginTop: '10px',
        }}
      />
    </div>
  );
};

export default CalendarQuestion;