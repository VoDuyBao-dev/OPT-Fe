import { Logo } from "~/components/layouts/header/headerComp";
import styles from './HeaderForm.module.scss';
function HeaderForm({title, description}) {
    return ( 
        <div className={styles.headerForm}>
            <span className={styles.logo}> <Logo /> </span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
        </div>
     );
}

export default HeaderForm;