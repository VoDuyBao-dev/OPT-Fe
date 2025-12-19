import BenefitsHead from './bennefisHead/BenefitsHead';
import BenefitsBody from './bennefitsBody/BenefitsBody';
import styles from './Bennefits.module.scss';

function Bennefits() {
    return (
        <section className={styles.benefits}>
            <div className={styles.benefitsContainer}>
                <BenefitsHead />
                <BenefitsBody />
            </div>
        </section>
    );
}

export default Bennefits;
