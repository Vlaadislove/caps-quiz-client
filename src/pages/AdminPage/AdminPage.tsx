import { Outlet } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavVBar';
import styles from './AdminPage.module.css';

const AdminPAge = () => {
  
  return (
    <div className={styles.container}>

      <div className={styles.styledNavbar}>
        <NavBar />
      </div>

      <div className={styles.styledBar}>
        <Outlet />
      </div>

    </div>
  );
};

export default AdminPAge;
