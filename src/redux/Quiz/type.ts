export interface AnswerOption {
  text?: string;
  file?: string;
}

export interface Question {
  id: string;
  question: string;
  required: boolean;
  type: 'multiple' | 'single' | 'input' | 'imageText' | 'imageUrl' | 'dropdownList' | 'fileUpload' | 'calendar';
  answers: AnswerOption[] | string[];
}

export interface ContactInput {
  id: string;
  placeholder: string;
  required?: boolean;
  value?: string;
}

export interface ContactForm {
  backgroundImage: {
    file: string;
    _id: string;
  };
  leftInputs: ContactInput[];
  rightInputs: ContactInput[];
}

export interface Design {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
}

export interface StartPage {
  formData: {
    buttonText: string;
    companyName: string;
    companySlogan: string;
    description: string;
    phoneNumber: string;
    title: string;
  };
  alignment: 'left' | 'right' | 'center';
  backgroundImage: {
    file: string;
    _id: string;
  };
  backgroundImageMobile: {
    file: string;
    _id: string;
  };
  logoImage: {
    file: string;
    _id: string;
  };
  layout: string;
}

export interface Quiz {
  _id: string;
  quizId: string;
  startPage: StartPage;
  questions: Question[];
  contactForm: ContactForm;
  design: Design;
  quizInfo: QuizInfo
}

interface QuizInfo {
  nameQuiz: string;
  notificationEmail: string;
  personalDataPolicy:  string
  privacyPolicy: string
}

export interface QuizState {
  quiz: Quiz | null;
  answers: Record<string, IAnswerDetail>;
  contactInfo: Record<string, string>;
  currentStep: number;
}



export interface IAnswers {
  answers: Record<string, IAnswerDetail>;
  formContact: { [key: string]: string };
}

export interface IAnswerDetail {
  question: string;
  answer: string | string[] | File | null;
  questionType: Question['type'];
}