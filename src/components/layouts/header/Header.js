import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { Logo, Notification, Avata, Navbar, Action } from './headerComp'
import styles from './Header.module.scss'
import { logout as logoutApi } from '../../../api/services/logoutAPI'
import { getLearnerProfile } from '~/api/services/leanerService';
import { fetchPersonalInfo } from '~/api/services/tutorService';
import { fetchAdminProfile } from '~/api/services/adminProfileService';
import defaultAvatar from '~/assets/imgs/img.jpg';

function Header({ showNavbar = true, showHeaderUser = true, userType = false }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [visible, setVisible] = useState(true);
    const lastScroll = useRef(0);
    const timeoutRef = useRef(null);

    const [userData, setUserData] = useState({ fullName: '', avatarUrl: '' });

    const headerLinks = [
        { path: '/', element: <Logo />, userType: false },
        { path: '/', element: <Logo />, userType: 'learner' },
        { path: '/tutor/home', element: <Logo />, userType: 'tutor' },
        { path: '/admin/dashboard', element: <Logo />, userType: 'admin' }
    ];

    // Load avatar/name for current role
    useEffect(() => {
        if (!userType) {
            setUserData({ fullName: '', avatarUrl: '' });
            return;
        }

        const loadProfile = async () => {
            try {
                let data = null;
                if (userType === 'learner') {
                    data = await getLearnerProfile();
                } else if (userType === 'tutor') {
                    data = await fetchPersonalInfo();
                } else if (userType === 'admin') {
                    const res = await fetchAdminProfile();
                    data = res?.data?.result;
                }

                setUserData({
                    fullName: data?.fullName || 'Người dùng',
                    avatarUrl: data?.avatarUrl || data?.avatar || '',
                });
            } catch (err) {
                console.error('Load header profile failed:', err);
                setUserData((prev) => ({
                    fullName: prev.fullName || 'Người dùng',
                    avatarUrl: prev.avatarUrl || '',
                }));
            } finally {
            }
        };

        loadProfile();
    }, [userType]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const clearHideTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const scheduleHide = () => {
        clearHideTimer();
        if (window.scrollY > 50) {
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
            }, 3000);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        closeMobileMenu();
        try {
            await logoutApi();
        } catch (err) {
            console.error('Logout failed:', err);
        }

        ['token', 'role', 'userType', 'user'].forEach((key) => {
            localStorage.removeItem(key);
        });

        // Refresh trang để cập nhật giao diện sau khi đăng xuất
        window.location.href = '/login';
    };

    const getProfilePath = () => {
        if (userType === 'learner') return '/profile';
        if (userType === 'tutor') return '/tutor/profile';
        if (userType === 'admin') return '/admin/profile';
        return '/';
    };

    const getUserMenu = () => {
        const learnerMenu = [
            { label: 'Hồ sơ của bạn', path: '/Profile' },
            { label: 'Lớp đã học', path: '/Classed' },
            { label: 'Yêu cầu đã gửi', path: '/Request' },
            { label: 'Đăng xuất', action: 'logout' },
        ];

        const tutorMenu = [
            { label: 'Hồ sơ của bạn', path: '/tutor/profile' },
            { label: 'Trang chủ gia sư', path: '/tutor/home' },
            { label: 'Đăng xuất', action: 'logout' },
        ];

        const adminMenu = [
            { label: 'Hồ sơ của bạn', path: '/admin/profile' },
            { label: 'Dashboard admin', path: '/admin/dashboard' },
            { label: 'Đăng xuất', action: 'logout' },
        ];

        if (userType === 'learner') return learnerMenu;
        if (userType === 'tutor') return tutorMenu;
        if (userType === 'admin') return adminMenu;
        return [];
    };

    // Scroll behavior for header visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            // Xóa timer khi đang cuộn nếu ngươuì dùng di chuyện sẽ không ẩn header
            clearHideTimer();

            // --- Logic xuất hiện / biến mất ---
            if (currentScroll <= 80) {
                setVisible(true); // đầu trang từ 0 -80px
            } else if (currentScroll > lastScroll.current && currentScroll > 80) {
                setVisible(false); // cuộn xuống > 80px
            } else {
                setVisible(true); // cuộn lên
            }

            lastScroll.current = currentScroll;

            // --- Nếu dừng cuộn 3 giây ---
            scheduleHide();
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearHideTimer();
        };
    }, []);

    return (
        <header className={clsx(styles.header, { 
            [styles.showActions]: userType === 'tutor',
            [styles.show]: visible,
            [styles.hide]: !visible
        })}
            onMouseEnter={() => {
                clearHideTimer();
                setVisible(true);
            }}
            onMouseLeave={scheduleHide}
        >
            <div className={styles.headerCtn}>
                <div className={styles.headerTop}>
                    {/* Logo */}
                    {headerLinks.map((link, index) => (
                        link.userType === userType && (
                            <Link key={index} to={link.path} className={styles.logoLink}>
                                {link.element}
                            </Link>
                        )
                    ))}

                    {/* Desktop Navigation - Hidden for tutor and admin */}
                    {userType !== 'tutor' && (
                        <div className={styles.desktopNav}>
                            {showNavbar && <Navbar userType={userType} />}
                        </div>
                    )}

                    {/* Desktop User Section / Actions */}
                    <div className={styles.desktopActions}>
                        {userType === false ? (
                            <Action />
                        ) : (
                            showHeaderUser && (
                                <div className={styles.headerUser}>
                                    <Notification />
                                    <Avata userType={userType} avatarUrl={userData.avatarUrl} />
                                </div>
                            )
                        )}
                    </div>

                    {/* Mobile Right Section - Hidden for tutor and admin */}
                    {userType !== 'tutor' && (
                        <div className={styles.mobileRight}>
                            {/* Notification - visible on mobile for logged-in users */}
                            {userType !== false && showHeaderUser && (
                                <div className={styles.mobileNotification}>
                                    <Notification />
                                </div>
                            )}

                            {/* Hamburger Menu Toggle */}
                            <button
                                className={styles.hamburger}
                                onClick={toggleMobileMenu}
                                aria-label="Toggle menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Slide-in Menu - Hidden for tutor */}
            {userType !== 'tutor' && (
                <div className={clsx(styles.mobileMenu, { [styles.open]: isMobileMenuOpen })}>
                    <div className={styles.mobileMenuContent}>
                        {/* Navigation Items */}
                        {showNavbar && (
                            <div className={styles.mobileNavSection}>
                                <Navbar userType={userType} onLinkClick={closeMobileMenu} isMobile={true} />
                            </div>
                        )}

                        {/* User Section or Action Buttons */}
                        {userType === false ? (
                            <div className={styles.mobileActionSection}>
                                <Action onLinkClick={closeMobileMenu} isMobile={true} />
                            </div>
                        ) : (
                            showHeaderUser && (
                                <div className={styles.mobileUserSection}>
                                    <Link
                                        to={getProfilePath()}
                                        className={styles.userProfile}
                                        onClick={closeMobileMenu}
                                    >
                                        <div className={styles.userAvatar}>
                                            <img src={userData.avatarUrl || defaultAvatar} alt={userData.fullName} />
                                        </div>
                                        <span className={styles.userName}>{userData.fullName}</span>
                                    </Link>
                                    <button
                                        className={styles.logoutBtn}
                                        onClick={handleLogout}
                                        aria-label="Đăng xuất"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                    </button>
                                    <ul className={styles.mobileDropdownList}>
                                        {getUserMenu().map((item) => (
                                            <li key={item.label}>
                                                {item.action === 'logout' ? (
                                                    <button type="button" onClick={handleLogout}>{item.label}</button>
                                                ) : (
                                                    <Link to={item.path} onClick={closeMobileMenu}>{item.label}</Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Overlay - Hidden for tutor */}
            {userType !== 'tutor' && isMobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
            )}
        </header>
    )
}
export default Header;