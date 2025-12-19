import axiosInstance from "../client/axios";

export const getDashboard = async () => {
  try {
    const res = await axiosInstance.get("/admin/dashboard", {
      timeout: 15000,
    });

    const data = res.data?.result;
    if (!data) return null;

    return {
      // ===== Tổng quan =====
      overview: {
        totalLearners: data.totalLearners ?? 0,
        totalTutors: data.totalTutors ?? 0,
        totalClassRequests: data.totalClassRequests ?? 0,
        totalEbooks: data.totalEbooks ?? 0,
      },

      // ===== Ebook =====
      ebookStats: {
        SACH_GIAO_KHOA: data.ebookByType?.SACH_GIAO_KHOA ?? 0,
        TAI_LIEU: data.ebookByType?.TAI_LIEU ?? 0,
        DE_THI_THAM_KHAO: data.ebookByType?.DE_THI_THAM_KHAO ?? 0,
      },

      // ===== Top môn được yêu cầu =====
      topRequestedSubjects: data.topRequestedSubjects ?? [],

      // ===== Top môn có nhiều gia sư ===== ✅ FIX
      topSubjectsByTutor: data.topSubjectsByTutor ?? [],

      // ===== Rating =====
      ratingDistribution: data.ratingDistribution ?? {},

      // ===== Request status =====
      requestStatusDistribution: data.requestStatusDistribution ?? {},

      // ===== Tutor verification =====
      tutorVerification: {
        approved: data.tutorVerificationStatus?.APPROVED ?? 0,
        pending: data.tutorVerificationStatus?.PENDING ?? 0,
      },
    };

  } catch (err) {
    console.error("Dashboard stats error:", err.response?.data || err);
    throw err;
  }
};
