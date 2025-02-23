import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import AdminPage from '../pages/AdminPage/AdminPage';
import CreateQuizForm from '../components/CreateQuizForm/CreateQuizForm';
import MyQuizes from '../components/MyQuizes/MyQuizes';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import QuizDetails from '../components/QuizDetails/QuizDetails';

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  if (isAuth) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  if (!isAuth) {
    return <Navigate to="/404" />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/kgjFkgsdgGgkg/login",
        element: (
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        ),
      },

      {
        path: "/admin/*",
        element: (
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <CreateQuizForm />,
          },
          {
            path: "my-quiz",
            element: <MyQuizes />,
          },
          {
            path: "create-quiz",
            element: <CreateQuizForm />,
          },
          {
            path: "*",
            element: <Navigate to="/404" />,
          },
        ],
      },
      
      {
        path: "/my-quiz/:id",
        element: <QuizDetails />,
      },

      {
        path: "/",
        element: (
          <PrivateRoute>
            <Navigate to="/kgjFkgsdgGgkg/login" />
          </PrivateRoute>
        ),
      },
      {
        path: "/404",
        element: <ErrorPage />,
      },
      {
        path: "*",
        element: <Navigate to="/404" />,
      },
    ],
  },
]);
