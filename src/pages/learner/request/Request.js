import React, { useEffect, useState } from "react";
import styles from "~/components/Learner/profile/Profile.module.scss";
import RequestsTab from "~/components/Learner/request/request";
import RequestDetailModal from "~/components/Learner/request/requetsDetail";
import { getLearnerRequests } from "~/api/services/leanerService";

export default function LearnerDashboard() {
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ==========================
  // Load requests
  // ==========================
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getLearnerRequests();

        const mapped = data.map((r) => ({
          id: r.requestId,
          tutor: r.tutor,
          subject: r.subject,
          date: r.startDate,
          schedule: `${r.startDate} → ${r.endDate}`,
          note: r.additionalNotes,
          type: r.type === "Học thử" ? "trial" : "official",
          status: r.status,
          statusLabel: r.status,
        }));

        setRequests(mapped);
      } catch (err) {
        console.error("Load requests error:", err);
      }
    };

    loadRequests();
  }, []);

  // ==========================
  // View detail
  // ==========================
  const handleViewRequest = (req) => {
    setSelectedRequest(req);
    setOpenModal(true);
  };

  return (
    <div className={styles["ld-root"]}>
      <main className={styles["ld-main"]}>
        <RequestsTab
          requests={requests}
          onViewRequest={handleViewRequest}
        />
      </main>

      <RequestDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        request={selectedRequest}
      />
    </div>
  );
}
