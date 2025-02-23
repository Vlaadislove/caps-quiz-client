import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQuiz, nextStep, prevStep, updateAnswer, updateContactInfo } from '../../redux/Quiz/QuizSlice';
import StartPage from './StartPage/StartPage';
import QuestionPage from './QuestionPage/QuestionPage';
import { AppDispatch, RootState } from '../../redux/store';
import ContactFormQuiz from './ContactFormQuiz/ContactFormQuiz';
import { useParams } from 'react-router-dom';
import styles from './QuizDetails.module.css'
import { hexToRgb } from '../../utils/lib';


const Quiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quiz, currentStep, answers, contactInfo, } = useSelector((state: RootState) => state.quiz);
  const params = useParams()


  useEffect(() => {
    dispatch(getQuiz(params.id as string));
  }, [dispatch]);

  if (!quiz) {
    return null
  }

  const handleUpdateContactInfo = (info: { [key: string]: string }) => {
    dispatch(updateContactInfo(info));
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const themeStyles: Record<string, string> = {
    "--background-color": quiz.design.backgroundColor,
    "--text-color": quiz.design.textColor,
    "--button-color": quiz.design.buttonColor,
    "--button-text-color": quiz.design.buttonTextColor,
    "--button-color-rgb": hexToRgb(quiz.design.buttonColor)
  };

  if (currentStep === -1) {
    return <div className={styles.container} style={themeStyles}><StartPage onNext={handleNext} startPage={quiz.startPage} /></div>
  }

  if (currentStep < quiz.questions.length) {
    const question = quiz.questions[currentStep];
    const answerData = answers[question.id];
    const answer = answerData.answer; // Извлекаем только поле `answer`
    const isNextDisabled = !answer || (Array.isArray(answer) && answer.length === 0);
    // const isNextDisabled = question.required && (!answer || answer.length === 0);

    return (
      <div style={themeStyles} className={styles.questionContainer} >
        <QuestionPage
          question={question}
          answer={answer}
          onAnswer={(answer) => dispatch(updateAnswer({ questionId: question.id, answer }))}
          onNext={handleNext}
          onPrev={handlePrev}
          isNextDisabled={isNextDisabled}
        />
      </div>

    );
  }

  return (
    <div style={themeStyles}>
      <ContactFormQuiz
        handleUpdateContactInfo={handleUpdateContactInfo}
        contactForm={quiz.contactForm}
        contactInfo={contactInfo}
        links = {{privacyPolicy: quiz.quizInfo.privacyPolicy, personalDataPolicy: quiz.quizInfo.personalDataPolicy}}
      />
    </div>

  );
};

export default Quiz;