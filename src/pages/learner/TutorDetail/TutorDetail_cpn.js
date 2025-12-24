import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TutorDetail.scss";
import { FaStar } from "react-icons/fa";
import ClassCard from "~/components/Learner/Card/Card";
import TutorFormModal from "~/components/Learner/TutorModal/TutorModal";
import { getTutorDetail } from "~/api/services/leanerService";
import { getRelatedClasses } from "~/api/services/publicService";

const TutorDetail = () => {
  const { tutorId } = useParams();

  const [tutor, setTutor] = useState(null);
  const [relatedClasses, setRelatedClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("course");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================
  // FETCH TUTOR DETAIL
  // =========================
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await getTutorDetail(tutorId);
        setTutor(res.data.result);
      } catch (err) {
        console.error("❌ Lỗi lấy tutor detail", err);
      }
    };

    fetchTutor();
  }, [tutorId]);

  // =========================
  // FETCH RELATED CLASSES
  // =========================
  useEffect(() => {
    if (!tutor?.subject?.subjectId || !tutor?.tutorId) return;

    const fetchRelated = async () => {
      try {
        const res = await getRelatedClasses({
          classId: tutor.classes?.[0]?.classId || 0,
          subjectId: tutor.subject.subjectId,
          tutorId: tutor.tutorId,
        });

        setRelatedClasses(res.data.result || []);
      } catch (err) {
        console.error("❌ Lỗi lấy lớp học liên quan", err);
      }
    };

    fetchRelated();
  }, [tutor]);


  // =========================
  // LOADING (SAU TOÀN BỘ HOOK)
  // =========================
  if (!tutor) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // =========================
  // DATA MAPPING
  // =========================
  const mainSubject = tutor.subject;
  const reviews = tutor.recentReviews || [];

  return (
    <div className="tutor-detail-page">
      {/* ================= HEADER ================= */}
      <div className="tutor-detail-header">
        <div className="image-section">
          <img
            src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"}
            alt={tutor.fullName}
            className="main-img"
          />

          <div className="thumbnail-list">
            <img src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"} alt="" />
            <img src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"} alt="" />
            <img src={tutor.avatarImage || tutor.avatarUrl || "/default-avatar.png"} alt="" />
          </div>
        </div>

        <div className="info-section">
          <h2>{mainSubject?.subjectName}</h2>
          <p>
            Giáo viên:{" "}
            <span className="teacher">{tutor.fullName}</span>
          </p>
          <h3 className="price">
            {tutor.pricePerHour.toLocaleString()}đ
          </h3>
          <p className="desc">{tutor.introduction}</p>

          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Đăng ký thuê gia sư
          </button>

          <TutorFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tutorId={tutor.tutorId}
            subjectId={mainSubject?.subjectId}
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="tab-buttons">
        {["course", "teacher", "review"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "course" && "THÔNG TIN KHÓA HỌC"}
            {tab === "teacher" && "THÔNG TIN GIÁO VIÊN"}
            {tab === "review" && "ĐÁNH GIÁ CHI TIẾT"}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="tab-content">
        {activeTab === "course" && (
          <div>
            <p>{tutor.introduction}</p>
            <ul>
              <li>Kinh nghiệm: {tutor.educationalLevel}</li>
              <li>Trường: {tutor.university}</li>
              <li>Địa chỉ: {tutor.address}</li>
              <li>Học thử trước khi học chính thức</li>
            </ul>
          </div>
        )}

        {activeTab === "teacher" && (
          <div className="teacher-info">
            <h4>{tutor.fullName}</h4>
            <p>
              {tutor.educationalLevel} - {tutor.university}
            </p>
            <p>{tutor.introduction}</p>
          </div>
        )}

        {activeTab === "review" && (
          <div className="reviews-section">
            {reviews.map((r) => (
              <div key={r.ratingId} className="review-card">
                <div className="review-header">
                  <img
                    src={r.learnerAvatar}
                    alt={r.learnerName}
                    className="avatar"
                  />
                  <div>
                    <p className="name">{r.learnerName}</p>
                    <div className="stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          color={
                            i < Math.round(r.score)
                              ? "#f59e0b"
                              : "#e5e7eb"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="comment">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= OTHER CLASSES ================= */}
      <div className="other-classes">
        <h2>Lớp học khác</h2>
        <div className="class-grid">
          {relatedClasses.length === 0 && (
            <p>Không có lớp học liên quan</p>
          )}
          {relatedClasses.map((item) => (
            <ClassCard key={item.classId} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;
