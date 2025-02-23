import React from 'react';
import { useSelector } from 'react-redux';
import questionComponents from './questionComponents';
import { RootState } from '../../../redux/store';
import { Question } from '../../../redux/Quiz/type';
import styles from './QuestionPage.module.css';
import { ArrowLeft } from 'lucide-react';



export interface QuestionPageProps {
  question: Question;
  answer: string | string[] | File | null; // Обновлённый тип
  onAnswer: (answer: string | string[] | File | null) => void;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled: boolean;
}


const QuestionPage: React.FC<QuestionPageProps> = ({ question, answer, isNextDisabled, onAnswer, onNext, onPrev }) => {
  const { currentStep, quiz } = useSelector((state: RootState) => state.quiz);

  if(!quiz?.questions){
    return null
  }

  if (!question) {
    return <p>Вопрос не найден</p>;
  }

  const QuestionComponent = questionComponents[question.type];
  if (!QuestionComponent) {
    return <p>Неизвестный тип вопроса</p>;
  }

  function getProgressPercentage(currentPage:number, totalPages:number) {
    if (totalPages === 0) return 0; // Защита от деления на ноль
    return ((currentPage / totalPages) * 100).toFixed(0);
}

return (
  <div className={styles.container}>
    <div className={styles.content}>
      <QuestionComponent
        question={question}
        answer={answer}
        onAnswer={onAnswer}
        onNext={onNext}
      />
    </div>
    <div className={styles.navigation}>
      <div className={styles.progressSection}>
        <span className={styles.progressText}>
          Готово: <span className={styles.percent}>{getProgressPercentage(currentStep, quiz.questions.length)}%</span>
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${getProgressPercentage(currentStep, quiz.questions.length)}%` }}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          disabled={currentStep === 0}
          className={styles.navButton}
          onClick={onPrev}
        >
          {/* Стрелка назад */}
          <ArrowLeft />
        </button>
        <button
          className={styles.nextButton}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {currentStep !== quiz.questions.length-1 ?'Далее' : 'Последний шаг'}
        </button>
      </div>
    </div>
  </div>
);
};


export default QuestionPage;
