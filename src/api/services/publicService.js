import axiosInstance from "../client/axios";

// ========================
// 13. Lấy danh sách lớp học liên quan (public, no token required)
// Endpoint: GET /classes/related?subjectId=..&tutorId=..
export const getRelatedClasses = async ({ subjectId, tutorId }) => {
  const res = await axiosInstance.get('/classes/related', {
    params: {
      subjectId: subjectId != null ? Number(subjectId) : undefined,
      tutorId: tutorId != null ? Number(tutorId) : undefined,
    },
  });
  console.log('getRelatedClasses response:', res.data);

  return res.data;
};
