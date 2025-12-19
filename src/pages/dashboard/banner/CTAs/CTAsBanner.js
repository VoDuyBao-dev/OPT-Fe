import { useNavigate } from 'react-router-dom';
import Button from '~/components/button/Button';
import { faSearch, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import styles from './CTAsBanner.module.scss';

function CTAsBanner() {
    const navigate = useNavigate();

    const handleFindTutor = () => {
        navigate('/tutor');
    };

    const handleBecomeTutor = () => {
        navigate('/register/tutor');
    };

    return (
        <div className={styles.ctasWrapper}>
            <Button
                variant="primary"
                size="large"
                leftIcon={faSearch}
                onClick={handleFindTutor}
                className={styles.ctaButton}
            >
                Tìm gia sư
            </Button>
            
            <Button
                variant="outline"
                size="large"
                leftIcon={faChalkboardTeacher}
                onClick={handleBecomeTutor}
                className={styles.ctaButton}
            >
                Trở thành gia sư
            </Button>
        </div>
    );
}

export default CTAsBanner;
