import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { 
    faFacebookF, 
    faYoutube as faYoutubeBrand 
} from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss';
import { Logo } from '../header/headerComp';

function Footer() {
    const navigate = useNavigate();

    const quickLinks = [
        { text: 'Tìm gia sư', path: '/tutor' },
        { text: 'Trở thành gia sư', path: '/register/tutor' },
        { text: 'Thư viện E-books', path: '/learner/e-books' },
        { text: 'Về chúng tôi', path: '/about' }
    ];

    const supportLinks = [
        { text: 'Trung tâm trợ giúp', path: '/help' },
        { text: 'Điều khoản sử dụng', path: '/terms' },
        { text: 'Chính sách bảo mật', path: '/privacy' },
        { text: 'Câu hỏi thường gặp', path: '/faq' }
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    {/* Brand Section */}
                    <div className={styles.column}>
                        <div className={styles.brand}>
                            <Logo/>
                        </div>
                        <p className={styles.brandDescription}>
                            Kết nối tri thức – Nâng tầm tương lai. Nền tảng kết nối gia sư và học viên hàng đầu Việt Nam.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <FontAwesomeIcon icon={faYoutubeBrand} />
                            </a>
                            <a href="mailto:support@tutorconnect.vn" className={styles.socialIcon}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Liên kết nhanh</h3>
                        <ul className={styles.linkList}>
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                        href='#'
                                        onClick={() => navigate(link.path)} 
                                        className={styles.link}
                                    >
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Hỗ trợ</h3>
                        <ul className={styles.linkList}>
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                        href='#'
                                        onClick={() => navigate(link.path)} 
                                        className={styles.link}
                                    >
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Liên hệ</h3>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📍</span>
                                <span>123 Đường ABC, Quận 1, TP. HCM</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📞</span>
                                <span>1900 1234</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>✉️</span>
                                <span>support@tutorconnect.vn</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className={styles.footerBottom}>
                    <span className={styles.copyright}>
                        &copy; 2025 TutorFinder. Tất cả quyền được bảo lưu.
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;