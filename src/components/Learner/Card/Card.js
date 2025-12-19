import React, {useState} from "react";
import "~/pages/learner/TutorDetail/TutorDetail.scss";
import TutorFormModal from "../TutorModal/TutorModal";


// Component tái sử dụng cho từng lớp học
const ClassCard = ({ image, subject, teacherName, teacherLevel, price, description, onRegister }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="class-card">
          <img src={image} alt={subject} className="class-main-img" />
          <div className="class-info">
            <div className="teacher-info">
              <div>
          <p className="teacher-name">{teacherName}</p>
          <p className="teacher-level">{teacherLevel}</p>
        </div>
      </div>

      <h3 className="class-subject">{subject}</h3>
      <p className="class-price">{price}</p>
      <p className="class-desc">{description}</p>

      <div className="class-actions">
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}> Đăng ký</button>
        <TutorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        />
        <button className="btn-google"><a href={`/Tutor/${teacherName}`}>Chi tiết</a></button>
      </div>
    </div>
  </div>
);
}

export default ClassCard;