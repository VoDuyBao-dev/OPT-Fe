import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AvatarSection.module.scss';

function AvatarSection({ adminData, isEditing, editData }) {
    return (
        <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatarPlaceholder}>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
            <div className={styles.roleInfo}>
                <h2 className={styles.name}>{isEditing ? editData.fullName : adminData.fullName}</h2>
                <span className={styles.role}>{adminData.role}</span>
            </div>
        </div>
    );
}

export default AvatarSection;