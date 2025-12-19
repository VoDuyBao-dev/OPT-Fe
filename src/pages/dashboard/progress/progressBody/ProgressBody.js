import StepCard from './stepCard/StepCard';
import styles from './ProgressBody.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCalendarCheck, faBook, faStar } from '@fortawesome/free-solid-svg-icons';

function ProgressBody() {
    const steps = [
        {
            icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
            number: 1,
            title: 'Tìm kiếm',
            description: 'Tìm gia sư phù hợp theo môn học và khu vực của bạn'
        },
        {
            icon: <FontAwesomeIcon icon={faCalendarCheck} />,
            number: 2,
            title: 'Đặt lịch học thử',
            description: 'Đặt buổi học thử miễn phí để trải nghiệm chất lượng'
        },
        {
            icon: <FontAwesomeIcon icon={faBook} />,
            number: 3,
            title: 'Học chính thức',
            description: 'Đăng ký lịch học chính thức và bắt đầu hành trình tri thức'
        },
        {
            icon: <FontAwesomeIcon icon={faStar} />,
            number: 4,
            title: 'Đánh giá',
            description: 'Đánh giá chất lượng giảng dạy và chia sẻ trải nghiệm'
        }
    ];

    return (
        <div className={styles.progressBody}>
            {steps.map((step, index) => (
                <StepCard
                    key={index}
                    icon={step.icon}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                />
            ))}
        </div>
    );
}

export default ProgressBody;
