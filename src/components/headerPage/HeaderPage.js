import styles from './HeaderPage.module.scss';

function HeaderPage({ title }) {
    return (
        <div className={styles.container}>
            <div className={styles.headerPage}>
                <h1 className={styles.title}>{title}</h1>
            </div>
        </div>
    );
}

export default HeaderPage;