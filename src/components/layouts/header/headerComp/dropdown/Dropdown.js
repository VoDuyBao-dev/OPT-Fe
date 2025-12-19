import clsx from "clsx";
import styles from "./Dropdown.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Dropdown({ arr, className, onLogout, onSelect }) {
    return (
        <div className={clsx(styles.Dropdown, className)}>
            <ul className={clsx(styles.List)}>
                {arr.map((item, index) => (
                    <li key={index} className={clsx(styles.ListItem)}>
                        
                        {/* Nếu item là logout → gọi hàm */}
                        {item.action === "logout" ? (
                            <div
                                className={clsx(styles.ListItemLink)}
                                onClick={() => {
                                    if (onLogout) onLogout();
                                    if (onSelect) onSelect();
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <FontAwesomeIcon 
                                    icon={item.icon} 
                                    className={clsx(styles.ListItemIcon)} 
                                />
                                <div>{item.label}</div>
                            </div>
                        ) : (
                            /* Các item bình thường → Link */
                            <Link 
                                to={item.path || '#'} 
                                className={clsx(styles.ListItemLink)}
                                onClick={() => {
                                    if (onSelect) onSelect();
                                }}
                            >
                                <FontAwesomeIcon 
                                    icon={item.icon} 
                                    className={clsx(styles.ListItemIcon)} 
                                />
                                <div>{item.label}</div>
                            </Link>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dropdown;
