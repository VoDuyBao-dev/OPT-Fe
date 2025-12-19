import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './Logo.module.scss'
function Logo({className}){

    return(
        <div className={clsx(styles.logo, className)}>
            <span className={styles.logoIcon}>
                <FontAwesomeIcon icon={faGraduationCap}/>
            </span>
            <span className={styles.logoTitle}>TutorFinder</span>
        </div>
    )
}
export default Logo;