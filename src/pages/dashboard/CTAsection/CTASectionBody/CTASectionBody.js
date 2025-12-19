import Button from '~/components/button/Button';
import styles from './CTASectionBody.module.scss';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { getUserType } from '~/utils/auth';

function CTASectionBody() {
    const navigate = useNavigate();
    const userType = getUserType();

    const features = [
        'Miễn phí đăng ký',
        'Học thử không mất phí',
        'Hỗ trợ 24/7'
    ];

    return (
        <div className={styles.ctaBody}>
            <div className={styles.buttonsWrapper}>
                {!userType && (
                    <Button 
                        variant="secondary" 
                        size="large"
                        leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                        onClick={() => navigate('/register/learner')}
                    >
                        Đăng ký ngay
                    </Button>
                )}
                <Button 
                    variant="outline" 
                    size="large"
                    rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
                    onClick={() => navigate('/tutor')}
                    className={styles.outlineButton}
                >
                    Tìm gia sư
                </Button>
            </div>
            
            <div className={styles.features}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                        <FontAwesomeIcon icon={faCircleCheck} className={styles.checkIcon} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CTASectionBody;
