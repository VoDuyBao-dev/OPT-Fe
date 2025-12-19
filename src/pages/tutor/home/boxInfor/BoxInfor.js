import { Link } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BoxInfor.module.scss";

function BoxInfor({ type = 'default', title, quanity, path, icon, unit, className }) {
    return (
        <div className={clsx(styles.boxInfor, className, {
            [styles.boxInforPrimary]: type === 'primary'
        })}>
            <div className={styles.boxCtn}>
                <div className={styles.itemBox}>
                    <h2>{title}</h2>
                    <p>{quanity}
                        {unit ? <span> {unit}</span> : null}
                    </p>
                    <Link to={path} className={styles.link}>Xem chi tiết</Link>
                </div>
                <div className={clsx(styles.iconBox)}>
                    <FontAwesomeIcon icon={icon} />
                </div>
            </div>
        </div>
    );
}

export default BoxInfor;