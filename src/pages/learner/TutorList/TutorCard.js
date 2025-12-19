import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TutorList.scss";
import TutorModal from "~/components/Learner/TutorModal/TutorModal";

const TutorCard = ({ tutor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <article className="tutor-card">
      <div className="tutor-image">
        <Link to={`/Tutor/${tutor.tutorId}`}>
          <img
            src={tutor.avatarUrl || "/default-avatar.png"}
            alt={tutor.fullName}
          />
        </Link>
      </div>

      <div className="tutor-info">
        <Link to={`/Tutor/${tutor.tutorId}`} className="tutor-card-link">
          <p className="tutor-name">{tutor.fullName}</p>
          <p className="tutor-gender">Giới tính: {tutor.gender === "Male" ? "Nam" : "Nữ"}</p>
          <p className="tutor-address">Địa chỉ: {tutor.address}</p>
          <p className="tutor-university">Trường: {tutor.university}</p>
          <p className="tutor-level">Trình độ chuyên môn: {tutor.educationalLevel}</p>
          <h3 className="tutor-subject">
            {tutor.subjects?.join(", ")}
          </h3>
          <p className="tutor-price">
            {tutor.pricePerHour?.toLocaleString()}đ / buổi
          </p>
        </Link>

        <div className="tutor-actions">
          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Đăng ký
          </button>

          <TutorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tutorId={tutor.tutorId}   // 🔥 BẮT BUỘC
            subject={tutor.subjects[0]}  // 🔥 BẮT BUỘC
          />

          <Link
            to={`/Tutor/${tutor.tutorId}`}
            className="btn-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TutorCard;
