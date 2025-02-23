import { useState } from "react";
import Questions, { Answer } from "./Questions/Questions";
import ContactForm, { IContactForm } from "./ContactForm/ContactForm";
import Design, { IDesign } from "./Design/Design";
import StartPage, { IStartPage } from "./StartPage/StartPage";
import { processObjectToFormData } from "../../utils/lib";
import InformationAboutQuiz, { QuizInfo } from "./InformationAboutQuiz/InformationAboutQuiz";

export interface Question {
  id: string;
  question: string;
  type: "multiple" | "single" | "input" | "imageText" | "imageUrl" | "dropdownList" | "calendar" | "fileUpload";
  required: boolean;
  answers: Answer[];
  typeFile?: string
}

export interface IQuizData {
  startPage: IStartPage | null;
  questions: Question[];
  contactForm: IContactForm;
  design: IDesign;
}



const CreateQuizzForm = () => {
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [startPageData, setStartPageData] = useState<IStartPage>({
    backgroundImage: null,
    backgroundImageMobile: null,
    logoImage: null,
    formData: {
      companySlogan: "",
      title: "",
      description: "",
      buttonText: "",
      phoneNumber: "",
      companyName: "",
    },
    layout: "standard",
    alignment: "left",
    useStartPage: true
  });
  const [contactFormData, setContactFormData] = useState<IContactForm>({
    leftInputs: [
      { id: "title", placeholder: "Введите заголовок формы", value: "" },
      { id: "subtitle", placeholder: "Введите дополнительный текст", value: "" },
    ],
    rightInputs: [
      { id: "name", placeholder: "Имя", required: false },
      { id: "email", placeholder: "email@example.com", required: false },
      { id: "phone", placeholder: "+7 (900) 000-00-00", required: false },
    ],
    backgroundImage: null,
  });
  const [designData, setDesignData] = useState<IDesign>({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#007bff",
    buttonTextColor: "#ffffff",
  });
  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    nameQuiz: "",
    notificationEmail: "",
    personalDataPolicy: "",
    privacyPolicy: "",
  });


  const [activePage, setActivePage] = useState("startPage");

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };


  const handleCreateQuiz = async () => {


    const quizData = {
      startPage: startPageData.useStartPage ? startPageData : null,
      questions: questionsData,
      contactForm: contactFormData,
      design: designData,
      quizInfo
    };
    console.log("Созданный квиз:", quizData);

    try {
      const preparedFormData = processObjectToFormData(quizData);


      for (const [key, value] of preparedFormData.entries()) {
          console.log(`${key}:`, value instanceof File ? value.name : value);
      }
      console.log(preparedFormData.entries())
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/quiz/create-quiz`, {
          method: 'POST',
          body: preparedFormData,
          credentials: "include",
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
  } catch (error) {
      console.error('Upload failed:', error);
  }
  };

  return (
    <div>
      <h1>Create Quiz Form</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => handlePageChange("startPage")}>
            Стартовая страница
          </button>
          <button onClick={() => handlePageChange("questions")}>Вопросы</button>
          <button onClick={() => handlePageChange("contactForm")}>
            Форма контактов
          </button>
          <button onClick={() => handlePageChange("design")}>Дизайн</button>
          <button onClick={() => handlePageChange("informationAboutQuiz")}>Информация о квизе</button>
        </div>
        <button onClick={handleCreateQuiz} style={{ marginLeft: "auto" }}>
          Создать квиз!
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        {activePage === "startPage" && (
          <StartPage startPageData={startPageData} setStartPageData={setStartPageData} />
        )}
        {activePage === "questions" && (
          <Questions questionsData={questionsData} setQuestionsData={setQuestionsData} />
        )}
        {activePage === "contactForm" && (
          <ContactForm contactFormData={contactFormData} setContactFormData={setContactFormData} />
        )}
        {activePage === "design" && (
          <Design designData={designData} setDesignData={setDesignData} />
        )}
        {activePage === "informationAboutQuiz" && (
          <InformationAboutQuiz quizInfo={quizInfo} setQuizInfo={setQuizInfo} />
        )}
      </div>
    </div>
  );
};

export default CreateQuizzForm;

