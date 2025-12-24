import React, { useState, useEffect, useMemo } from "react";
import "./TutorList.scss";
import FilterSidebar from "./FilterSidebar";
import TutorCard from "./TutorCard";
import { searchTutorsByFilter } from "~/api/services/leanerService";

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const tutorsPerPage = 3;

  // ============================
  // Load ALL tutors lần đầu
  // ============================
  useEffect(() => {
    const loadTutors = async () => {
      try {
        const data = await searchTutorsByFilter({});
        setTutors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load tutors error:", err);
      }
    };

    loadTutors();
  }, []);

  // ============================
  // 🔥 DEDUPE tutors theo tutorId
  // ============================
  const uniqueTutors = useMemo(() => {
    const map = new Map();
    tutors.forEach((t) => {
      if (!t?.tutorId) return;
      const existing = map.get(t.tutorId);
      if (!existing) {
        map.set(t.tutorId, { ...t });
      } else {
        const mergedSubjects = [
          ...(existing.subjects || []),
          ...(t.subjects || []),
          ...(existing.subject ? [existing.subject] : []),
          ...(t.subject ? [t.subject] : []),
        ]
          .filter(Boolean)
          .reduce((acc, cur) => {
            const id = cur.subjectId || cur.id || cur.subject_id;
            if (id && !acc.some((s) => (s.subjectId || s.id || s.subject_id) === id)) {
              acc.push(cur);
            }
            return acc;
          }, []);

        map.set(t.tutorId, {
          ...existing,
          ...t,
          subjects: mergedSubjects,
        });
      }
    });
    return Array.from(map.values());
  }, [tutors]);

  // ============================
  // Pagination (SAU dedupe)
  // ============================
  const totalPages = Math.ceil(uniqueTutors.length / tutorsPerPage);
  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = uniqueTutors.slice(
    indexOfFirstTutor,
    indexOfLastTutor
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // ============================
  // Nhận kết quả từ FilterSidebar
  // ============================
  const handleFilterResult = (data) => {
    setTutors(Array.isArray(data) ? data : []);
    setCurrentPage(1);
  };

  return (
    <div className="tutor-container">
      <FilterSidebar onResult={handleFilterResult} />

      <div className="tutor-list">
        {currentTutors.length === 0 && (
          <p>Không tìm thấy gia sư phù hợp</p>
        )}

        {currentTutors.map((tutor) => (
          <TutorCard
            key={tutor.tutorId}   // ✅ giờ chắc chắn UNIQUE
            tutor={tutor}
          />
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              &laquo; Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Sau &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorList;
