import styles from './TutorCard.module.scss';
import Button from '~/components/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBook, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function TutorCard({ id, image, isVerified, name, subject, rating, reviewCount, location, price }) {
    const navigate = useNavigate();

    const ratingValue = Number(rating ?? 0).toFixed(1);

    const handleViewProfile = () => {
        navigate(`/tutor/${id}`);
    };

    return (
        <div className={styles.tutorCard}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={name} className={styles.image} />
                {isVerified && (
                    <span className={styles.verifiedBadge}>Đã xác thực</span>
                )}
            </div>
            
            <div className={styles.content}>
                <h3 className={styles.name}>{name}</h3>
                
                <div className={styles.subject}>
                    <FontAwesomeIcon icon={faBook} className={styles.subjectIcon} />
                    <span>{subject}</span>
                </div>
                
                <div className={styles.infoRow}>
                    <div className={styles.rating}>
                        <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                        <span className={styles.ratingValue}>{ratingValue}</span>
                        <span className={styles.reviewCount}>({reviewCount})</span>
                    </div>
                    
                    <div className={styles.location}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.locationIcon} />
                        <span>{location}</span>
                    </div>
                </div>
                
                <div className={styles.footer}>
                    <div className={styles.price}>{price}</div>
                    <Button 
                        variant="primary" 
                        size="small"
                        onClick={handleViewProfile}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TutorCard;
