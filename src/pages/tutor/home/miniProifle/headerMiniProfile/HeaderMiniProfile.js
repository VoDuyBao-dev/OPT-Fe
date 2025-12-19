import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./HeaderMiniProfile.module.scss";

function HeaderMiniProfile({ rating = 0 }) {
    return ( 
        <div className={styles.headerMiniProfile}>
            <h2>Thông tin gia sư</h2>
            <p>
                <FontAwesomeIcon icon={faStar}/>
                <span>{rating?.toFixed(1) || '0'}</span>
            </p>
        </div>
     );
}

export default HeaderMiniProfile;