import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { faAngleDown, faBook, faCheck, faHome, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Dropdown from '../dropdown/Dropdown';
import avt from '~/assets/imgs/img.jpg'
import styles from './Avata.module.scss'
import Modal from '~/components/modal/Modal';
import { logout } from '~/api/services/logoutAPI';

function Avata({ className, userType = 'learner' }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuLearnerArr = [
        { label: 'Hồ sơ của bạn', path: '/Profile', icon: faUser },
        { label: 'Lớp đã học', path: '/Classed', icon: faBook },
        { label: 'Yêu cầu đã gửi', path: '/Request', icon: faCheck },
        { label: 'Đăng xuất', action: 'logout', icon: faRightFromBracket },
    ];
    const menuArrTutor = [
        { label: 'Hồ sơ của bạn', path: '/tutor/profile', icon: faUser },
        { label: 'Trang chủ gia sư', path: '/tutor/home', icon: faHome },
        { label: 'Đăng xuất', action: 'logout', icon: faRightFromBracket },
    ];

    const menuArrAdmin = [
        { label: 'Hồ sơ của bạn', path: '/admin/profile', icon: faUser },
        { label: 'Dashboard admin', path: '/admin/dashboard', icon: faHome },
        { label: 'Đăng xuất', action: 'logout', icon: faRightFromBracket },
    ];

    const menuArr = userType === 'learner'
        ? menuLearnerArr
        : userType === 'tutor'
            ? menuArrTutor
            : menuArrAdmin;

const handleLogout = async () => {
  try {
    await logout(); // gọi API logout

  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // ✅ LUÔN clear đúng key
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    

    navigate("/login", { replace: true });
  }
};



    return (
        <div className={clsx(styles.account, className)} onClick={() => setOpen(!open)}>
            <div className={styles.accountCtn}>
                <div className={styles.accountAvt}>
                    <div className={styles.accountImg}>
                        <img src={avt} className={styles.accountImgItem} alt='avata'></img>
                    </div>
                    <div className={styles.accountIcon}>
                        <span className={clsx(styles.accountIconItem, open ? styles.rotate : '')}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </span>
                    </div>
                </div>

                <Dropdown
                    arr={menuArr}
                    onLogout={handleLogout}
                    onSelect={() => setOpen(false)}
                    className={clsx(styles.accountDropdown, open ? styles.show : '')} />
                {open && <Modal type='default'></Modal>}
            </div>
        </div>
    )
}
export default Avata;