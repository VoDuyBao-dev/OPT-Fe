import { useState } from 'react';
import { faAngleDown, faBook, faCheck, faHome, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Dropdown from '../dropdown/Dropdown';
import styles from './Avata.module.scss'
import Modal from '~/components/modal/Modal';
import { logout } from '~/api/services/logoutAPI';

function Avata({ className, userType = 'learner', avatarUrl }) {
    const [open, setOpen] = useState(false);

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
        await logout();
    } catch (err) {
        console.error("Logout error:", err);
    } finally {
        ['token', 'role', 'userType', 'user'].forEach((key) => {
            localStorage.removeItem(key);
        });
        window.location.href = "/login";
    }
};



    return (
        <div className={clsx(styles.account, className)} onClick={() => setOpen(!open)}>
            <div className={styles.accountCtn}>
                <div className={styles.accountAvt}>
                    <div className={styles.accountImg}>
                        {avatarUrl ? (
                            <img src={avatarUrl} className={styles.accountImgItem} alt='avatar'></img>
                        ) : (
                            <div className={styles.accountImgItem} aria-label="avatar placeholder">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                        )}
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