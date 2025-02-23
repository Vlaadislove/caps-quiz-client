import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logoutUser } from '../../redux/Auth/AuthSlice';

const NavBar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()


  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/404')
  };

  return (
    <div className={styles.navbar}>
      <h2>Admin</h2>
      <ul className={styles.navbar__ul}>
        <li className={styles.navbar__li}>
          <Link to="/admin/create-quiz" className={styles.link}>
            Create Quiz
          </Link>
        </li>
        <li className={styles.navbar__li}>
          <Link to="/admin/my-quiz" className={styles.link}>
            My Quizes
          </Link>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        LogOut
      </button>
    </div>
  );
};

export default NavBar;
