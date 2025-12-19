import { Link } from "react-router-dom";
import Button from "~/components/button/Button";
import styles from "./Action.module.scss";
function Action({ onLinkClick, isMobile = false }) {
    return (
        <div className={`${styles.action} ${isMobile ? styles.mobile : ''}`}>
            <Link to="/login" onClick={onLinkClick}>
                <Button variant="text">Đăng nhập</Button>
            </Link>
            <Link to="/register/learner" onClick={onLinkClick}>
                <Button variant="primary">Đăng ký</Button>
            </Link>
        </div>
    );
}

export default Action;