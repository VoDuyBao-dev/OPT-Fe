import BenefitItem from './benefitItem/BenefitItem';
import styles from './BenefitsBody.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldHalved, 
    faCalendarCheck, 
    faClock,
    faUsers,
    faChartLine,
    faCalendar
} from '@fortawesome/free-solid-svg-icons';

function BenefitsBody() {
    const learnerBenefits = [
        {
            icon: <FontAwesomeIcon icon={faShieldHalved} />,
            title: 'Gia sư đã được xác thực',
            description: 'Tất cả gia sư đều được kiểm tra hồ sơ và chứng chỉ kỹ lưỡng',
            color: 'blue'
        },
        {
            icon: <FontAwesomeIcon icon={faCalendarCheck} />,
            title: 'Học thử linh hoạt',
            description: 'Đặt lịch học thử miễn phí trước khi quyết định',
            color: 'blue'
        },
        {
            icon: <FontAwesomeIcon icon={faClock} />,
            title: 'Quản lý lịch học dễ dàng',
            description: 'Công cụ quản lý lịch học thông minh, tiện lợi',
            color: 'blue'
        }
    ];

    const tutorBenefits = [
        {
            icon: <FontAwesomeIcon icon={faUsers} />,
            title: 'Tiếp cận hàng ngàn học viên',
            description: 'Kết nối với học viên trên toàn quốc',
            color: 'yellow'
        },
        {
            icon: <FontAwesomeIcon icon={faChartLine} />,
            title: 'Quản lý hồ sơ chuyên nghiệp',
            description: 'Trang hồ sơ cá nhân giúp tăng độ tin cậy',
            color: 'yellow'
        },
        {
            icon: <FontAwesomeIcon icon={faCalendar} />,
            title: 'Lịch dạy linh hoạt',
            description: 'Tự quản lý thời gian và lịch dạy của bạn',
            color: 'yellow'
        }
    ];

    return (
        <div className={styles.benefitsBody}>
            <div className={styles.column}>
                <div className={styles.columnHeader}>
                    <h3 className={styles.columnTitle}>Dành cho Phụ huynh/Học viên</h3>
                    <div className={styles.underline}></div>
                </div>
                <div className={styles.benefitsList}>
                    {learnerBenefits.map((benefit, index) => (
                        <BenefitItem
                            key={index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color={benefit.color}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.column}>
                <div className={styles.columnHeader}>
                    <h3 className={styles.columnTitle}>Dành cho Gia sư</h3>
                    <div className={styles.underline}></div>
                </div>
                <div className={styles.benefitsList}>
                    {tutorBenefits.map((benefit, index) => (
                        <BenefitItem
                            key={index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color={benefit.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BenefitsBody;
