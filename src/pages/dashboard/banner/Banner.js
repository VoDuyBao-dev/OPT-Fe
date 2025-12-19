import TitleBanner from './title/TitleBanner';
import CTAsBanner from './CTAs/CTAsBanner';
import BGBanner from './bgBanner/BGBanner';
import styles from './Bannner.module.scss';

function Banner() {
    return (
        <section className={styles.banner}>
            <BGBanner />
            <div className={styles.bannerContainer}>
                <TitleBanner />
                <CTAsBanner />
            </div>
        </section>
    );
}

export default Banner;