import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TutorList.scss";
import TutorModal from "~/components/Learner/TutorModal/TutorModal";

const TutorCard = ({ tutor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primarySubject = tutor.subject || tutor.subjects?.[0];
  const detailHref = primarySubject?.subjectId
    ? `/Tutor/${tutor.tutorId}?subjectId=${primarySubject.subjectId}`
    : `/Tutor/${tutor.tutorId}`;

  return (
    <article className="tutor-card">
      <div className="tutor-image">
        <Link to={detailHref}>
          <img
            src={tutor.avatarUrl || tutor.avatarImage || "/default-avatar.png"}
            alt={tutor.fullName}
          />
        </Link>
      </div>

      <div className="tutor-info">
        <Link to={detailHref} className="tutor-card-link">
          <p className="tutor-name">{tutor.fullName}</p>

          {/* ✅ FIX gender */}
          <p className="tutor-gender">
            Giới tính: {tutor.gender === "MALE" ? "Nam" : "Nữ"}
          </p>

          <p className="tutor-address">Địa chỉ: {tutor.address}</p>
          <p className="tutor-university">Trường: {tutor.university}</p>
          <p className="tutor-level">
            Trình độ chuyên môn: {tutor.educationalLevel}
          </p>

          <h3 className="tutor-subject">
            {primarySubject?.subjectName || "Chưa cập nhật"}
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

          {/* ✅ FIX subject truyền cho modal */}
          <TutorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tutorId={tutor.tutorId}
            subject={tutor.subject || tutor.subjects?.[0]}
          />

          <Link
            to={detailHref}
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
