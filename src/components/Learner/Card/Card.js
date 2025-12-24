import React, { useMemo, useState } from "react";
import "~/pages/learner/TutorDetail/TutorDetail.scss";
import TutorFormModal from "../TutorModal/TutorModal";

// Component tái sử dụng cho từng lớp học
const ClassCard = ({
  image,
  subject,
  teacherName,
  teacherLevel,
  price,
  description,
  tutorId,
  onRegister,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const priceText = useMemo(() => {
    if (price == null || Number.isNaN(Number(price))) return "";
    return `${Number(price).toLocaleString("vi-VN")}đ/giờ`;
  }, [price]);

  const detailHref = tutorId ? `/Tutor/${tutorId}` : "#";
  const imgSrc = image || "https://placehold.co/400x240?text=Class";

  return (
    <div className="class-card">
      <img src={imgSrc} alt={subject} className="class-main-img" />
      <div className="class-info">
        <div className="teacher-info">
          <div>
            <p className="teacher-name">{teacherName}</p>
            <p className="teacher-level">{teacherLevel}</p>
          </div>
        </div>

        <h3 className="class-subject">{subject}</h3>
        <p className="class-price">{priceText}</p>
        <p className="class-desc">{description}</p>

        <div className="class-actions">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Đăng ký
          </button>
          <TutorFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tutorId={tutorId}
          />
          <button className="btn-google">
            <a href={detailHref}>Chi tiết</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;