import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faMapMarkerAlt, 
    faGraduationCap,
    faStar,
    faCheckCircle,
    faEdit,
    faSave,
    faTimes,
    faLock
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Button from '~/components/button/Button';
import styles from './ProfileHeader.module.scss';

function ProfileHeader({ 
    tutorData, 
    isEditing, 
    onEditClick, 
    onSaveClick, 
    onCancelClick,
    onPasswordClick,
    onAvatarChange
}) {
    const handleAvatarClick = () => {
        document.getElementById('avatarInput').click();
    };

    return (
        <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                    {tutorData.avatarUrl ? (
                        <img src={tutorData.avatarUrl} alt={tutorData.fullName} />
                    ) : (
                        <FontAwesomeIcon icon={faUser} />
                    )}
                </div>
                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={onAvatarChange}
                    style={{ display: 'none' }}
                />
                <button 
                    className={clsx(styles.changeAvatarBtn, {[styles.editing]: isEditing})}
                    onClick={handleAvatarClick}
                >
                    Đổi ảnh đại diện
                </button>
            </div>
            
            <div className={styles.headerInfo}>
                <div className={styles.nameSection}>
                    <h1 className={styles.name}>{tutorData.fullName}</h1>
                    {tutorData.verificationStatus === 'Approved' && (
                        <span className={styles.verifiedBadge}>
                            <FontAwesomeIcon icon={faCheckCircle} /> Đã xác thực
                        </span>
                    )}
                </div>
                
                <div className={styles.ratingSection}>
                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                    <span className={styles.rating}>{Math.round(tutorData.rating * 10) / 10}</span>
                    <span className={styles.reviews}>({tutorData.totalReviews} đánh giá)</span>
                </div>

                <div className={styles.quickInfo}>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{tutorData.address}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                        <span>{tutorData.university}</span>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    {!isEditing ? (
                        <Button 
                            variant="primary" 
                            leftIcon={<FontAwesomeIcon icon={faEdit} />}
                            onClick={onEditClick}
                        >
                            Chỉnh sửa hồ sơ
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="primary" 
                                leftIcon={<FontAwesomeIcon icon={faSave} />}
                                onClick={onSaveClick}
                            >
                                Lưu thay đổi
                            </Button>
                            <Button 
                                variant="outline" 
                                leftIcon={<FontAwesomeIcon icon={faTimes} />}
                                onClick={onCancelClick}
                            >
                                Hủy
                            </Button>
                        </>
                    )}
                    <Button 
                        variant="outline" 
                        leftIcon={<FontAwesomeIcon icon={faLock} />}
                        onClick={onPasswordClick}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;
