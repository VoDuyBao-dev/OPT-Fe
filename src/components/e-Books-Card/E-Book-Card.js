import styles from './E-Book-Card.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function EBookCard({ id, cover, title, author, category, description, disableNavigation = false }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disableNavigation) return;
        navigate(`/learner/e-books/${id}`);
    };

    return (
        <div
            className={styles.ebookCard}
            onClick={handleClick}
            role="button"
            aria-disabled={disableNavigation}
            tabIndex={disableNavigation ? -1 : 0}
            onKeyDown={(e) => {
                if (disableNavigation) return;
                if (e.key === 'Enter' || e.key === ' ') handleClick();
            }}
        >
            <div className={styles.coverWrapper}>
                {cover ? (
                    <img src={cover} alt={title} className={styles.cover} />
                ) : (
                    <div className={styles.defaultCover}>
                        <FontAwesomeIcon icon={faBook} />
                    </div>
                )}
                {category && (
                    <span className={styles.categoryBadge}>{category}</span>
                )}
            </div>
            
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                
                {author && (
                    <div className={styles.author}>
                        <FontAwesomeIcon icon={faUser} className={styles.authorIcon} />
                        <span>{author}</span>
                    </div>
                )}
                
                {description && (
                    <p className={styles.description}>{description}</p>
                )}
            </div>
        </div>
    );
}

export default EBookCard;
