import styles from './E-Book-Card.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function EBookCard({
  title,
  author,
  description,
  disableNavigation = false,
  children,               // ✅ THÊM
}) {
  return (
    <div
      className={styles.ebookCard}
      role="button"
      aria-disabled={disableNavigation}
      tabIndex={disableNavigation ? -1 : 0}
    >
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

        {/* ✅ ACTIONS HIỆN Ở ĐÂY */}
        {children && (
          <div className={styles.actions}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default EBookCard;
