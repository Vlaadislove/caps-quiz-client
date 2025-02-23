import { configureStore} from '@reduxjs/toolkit';
import { authSlice } from './Auth/AuthSlice';
import { quizSlice } from './Quiz/QuizSlice';



const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    quiz: quizSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
