import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import styles from './ContactFormQuiz.module.css';
import { postAnswer } from '../../../redux/Quiz/QuizSlice';

interface ContactInput {
  id: string;
  placeholder: string;
  required?: boolean;
  value?: string;
}

interface ContactForm {
  backgroundImage: {
    file: string;
  };
  leftInputs: ContactInput[];
  rightInputs: ContactInput[];
}



interface ContactFormProps {
  contactForm: ContactForm;
  contactInfo: { [key: string]: string };
  links: {personalDataPolicy: string, privacyPolicy: string}
  handleUpdateContactInfo: (info: { [key: string]: string }) => void;
}

const ContactFormQuiz: React.FC<ContactFormProps> = ({links, contactForm, contactInfo, handleUpdateContactInfo }) => {

  const [formContact, setFormContact] = useState(contactInfo);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [agrre, setAgree] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const { answers } = useSelector((state: RootState) => state.quiz);

  const handleChange = (id: string, value: string) => {
    const updatedState = { ...formContact, [id]: value };
    setFormContact(updatedState);
    handleUpdateContactInfo(updatedState);

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: false }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Останавливаем отправку формы, если есть ошибки

    const newErrors: { [key: string]: boolean } = {};

    contactForm.rightInputs.forEach((input) => {
      if (input.required && !formContact[input.id]?.trim()) {
        newErrors[input.id] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newContactInfoAndAnswers = {
      answers,
      formContact
    };

    dispatch(postAnswer(newContactInfoAndAnswers));

    console.log('Ответы на вопросы:', answers);
    console.log('Контактная информация:', formContact);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {contactForm.backgroundImage && <div
        className={styles.imageBlock}
        style={{ backgroundImage: `url(${contactForm.backgroundImage.file})`}}
      ></div>}
      <div className={styles.formBlock}>
        <h2 className={styles.formTitle}>Заполните форму, чтобы получить результаты теста</h2>
        {contactForm.rightInputs.map((input) => (
          <div key={input.id} className={styles.inputContainer}>
            <input
              type={input.id === 'email' ? 'email' : input.id === 'phone' ? 'tel' : 'text'}
              placeholder={input.placeholder}
              value={formContact[input.id] || ''}
              onChange={(e) => handleChange(input.id, e.target.value)}
              className={`${styles.input} ${errors[input.id] ? styles.inputError : ''}`}
            />
            {errors[input.id] && <p className={styles.errorText}>Это поле обязательно для заполнения.</p>}
          </div>
        ))}

        <div className={styles.privacyContainer}>
          <input
            type="checkbox"
            id="agree"
            className={styles.checkbox}
            required
            checked={agrre}
            onChange={() => setAgree(!agrre)}
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "Пожалуйста, ознакомьтесь и примите Положение об обработке персональных данных и Политику конфиденциальности, поставив галочку."
              )
            }
            onInput={(e) =>
              (e.target as HTMLInputElement).setCustomValidity("")
            }
          />
          <label htmlFor="agree" className={styles.privacyLabel}>
            Я соглашаюсь на <a target='_blank' href={links.personalDataPolicy} className={styles.privacyLink}>обработку персональных данных</a> согласно{' '}
            <a target='_blank' href={links.privacyPolicy} className={styles.privacyLink}>политике конфиденциальности</a>
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>Отправить</button>
      </div>
    </form>
  );
};

export default ContactFormQuiz;
