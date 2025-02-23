import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router'; // Импортируем объект маршрутов
import { useDispatch} from 'react-redux';
import { AppDispatch} from './redux/store';
import { getMe } from './redux/Auth/AuthSlice';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { isLoading, isAuth } = useSelector((state: RootState) => state.auth);


  const [isAuthChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(getMe());
      } finally {
        setAuthChecked(true);
      }
    };

    if (!isAuthChecked) {
      checkAuth();
    }
  }, [dispatch, isAuthChecked]);


  if (!isAuthChecked) {
    return null;
  }

  return <RouterProvider router={router} />;
};

export default App;
