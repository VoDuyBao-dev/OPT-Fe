import React, { useEffect, useState } from "react";
import styles from "~/components/Learner/profile/Profile.module.scss";
import ClassesTab from "~/components/Learner/classed/class";
import { ReviewModal } from "~/components/Learner/request/reviewModal";
import { getCompletedClasses, submitClassReview } from "~/api/services/leanerService";

export default function LearnerDashboard() {
  const [classes, setClasses] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // Load completed classes
  // ============================
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getCompletedClasses();
        setClasses(res);
      } catch (err) {
        console.error("Load classes error:", err);
      }
    };

    loadClasses();
  }, []);

  // ============================
  // Open review modal
  // ============================
  const handleWriteReview = (classItem) => {
    setSelectedClass(classItem);
    setReviewModalOpen(true);
  };

  // ============================
  // Submit review (CALL API)
  // ============================
  const handleSubmitReview = async ({ rating, comment, image }) => {
    if (!selectedClass) return;

    try {
      setSubmitting(true);

      await submitClassReview({
        classId: selectedClass.classId,
        rating,
        comment,
        image,
      });

      // ✅ Update UI: disable rating button
      setClasses((prev) =>
        prev.map((c) =>
          c.classId === selectedClass.classId
            ? { ...c, canRate: false }
            : c
        )
      );

      setReviewModalOpen(false);
      setSelectedClass(null);
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Gửi đánh giá thất bại, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles["ld-root"]}>
      <main className={styles["ld-main"]}>
        <ClassesTab
          classes={classes}
          onWriteReview={handleWriteReview}
        />
      </main>

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        classItem={selectedClass}
        loading={submitting}
      />
    </div>
  );
}
