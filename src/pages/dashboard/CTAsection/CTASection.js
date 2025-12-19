import CTASectionHead from './CTASectionHead/CTASectionHead';
import CTASectionBody from './CTASectionBody/CTASectionBody';
import styles from './CTASection.module.scss';

function CTASection() {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.ctaContainer}>
                <CTASectionHead />
                <CTASectionBody />
            </div>
        </section>
    );
}

export default CTASection;
