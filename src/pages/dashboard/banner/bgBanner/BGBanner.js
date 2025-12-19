import styles from './BGBanner.module.scss';
import bannerImg from '~/assets/imgs/bannerBg.jpg';

function BGBanner() {
    return (
        <div className={styles.bgBanner}>
            <img 
                src={bannerImg} 
                alt="Gia sư và học viên" 
                className={styles.bgImage}
            />
            <div className={styles.overlay}></div>
        </div>
    );
}

export default BGBanner;
