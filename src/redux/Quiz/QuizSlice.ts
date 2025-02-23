import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { QuizState, Quiz, IAnswers, IAnswerDetail } from './type';
import { instance } from '../../utils/axios';
import { RootState } from '../store';
import { processObjectToFormData } from '../../utils/lib';

export interface QuizSubmissionPayload extends IAnswers {
  quizId: string;
}

export const getQuiz = createAsyncThunk(
  'quiz/getQuiz',
  async (queryParams: string, { rejectWithValue }) => {
    try {
      const response = await instance.get<Quiz>(`quiz/get-quiz?quizID=${queryParams}`);
      return response.data; // Возвращаем данные квиза
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.response?.data || 'Ошибка при получении квиза');
    }
  }
);

export const postAnswer = createAsyncThunk(
  "quiz/postAnswer",
  async (newContactInfoAndAnswers: IAnswers, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { quiz } = state.quiz;

    if (!quiz) {
      return thunkAPI.rejectWithValue("Квиз не найден");
    }

    console.log('со стора', newContactInfoAndAnswers)
    console.log('со стора', quiz.quizId,)

    const payload: QuizSubmissionPayload = {
      quizId: quiz.quizId,
      ...newContactInfoAndAnswers,
    };

    try {
      const preparedFormData = processObjectToFormData(payload);

      for (const [key, value] of preparedFormData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }
      const response = await fetch('http://localhost:6600/api/quiz/send-answer', {
        method: 'POST',
        body: preparedFormData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      return response.status; // Возвращаем HTTP статус
      // const { data } = await instance.post(`/quiz/send-answer`, preparedFormData);
      // console.log(data)А

    } catch (error) {
      console.error('Upload failed:', error);
    }



    // const payload = {
    //   quizId: quiz.quizId,
    //   answers: Object.entries(answers).map(([questionId, answerObj]) => ({
    //     questionId,
    //     answer: answerObj.answer,
    //   })),
    //   contactInfo,
    // };

    // try {
    //   const response = await instance.post("https://api.example.com/submit-quiz", payload);

    //   thunkAPI.dispatch(resetQuiz());
    //   return response.data;
    // } catch (error: any) {
    //   console.error("Ошибка отправки:", error?.response?.data || error.message);
    //   return thunkAPI.rejectWithValue(error?.response?.data || "Ошибка отправки");
    // }

  }
);


const initialState: QuizState = {
  quiz: null,
  answers: {},
  contactInfo: {},
  currentStep: 0,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    updateAnswer(state, action) {
      const { questionId, answer } = action.payload;

      if (state.answers[questionId]) {
        state.answers[questionId].answer = answer; // Обновляем только поле answer
      }
    },

    updateContactInfo(state, action) {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
    nextStep(state) {
      state.currentStep += 1;
    },
    prevStep(state) {
      state.currentStep = Math.max(state.currentStep - 1, 0);
    },

    resetQuiz(state) {
      state.answers = {};
      state.contactInfo = {};
      state.currentStep = 0;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getQuiz.fulfilled, (state, action) => {
      const quiz = action.payload;
      state.quiz = quiz;
      state.currentStep = quiz.startPage === null ? 0 : -1
      // Инициализация answers
      state.answers = quiz.questions.reduce(
        (acc: Record<string, IAnswerDetail>, question) => {
          acc[question.id] = {
            question: question.question,
            answer: null,
            questionType: question.type,
          };
          return acc;
        },
        {}
      );
    });
    builder.addCase(getQuiz.rejected, (_, action) => {
      console.error('Ошибка получения квиза:', action.payload);
    });
  },
});

export const { updateAnswer, updateContactInfo, nextStep, prevStep, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
