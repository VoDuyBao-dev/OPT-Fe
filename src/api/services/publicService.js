import axiosInstance from "../client/axios";

// ========================
// 13. Lấy danh sách lớp học liên quan
// ========================
export const getRelatedClasses = ({ classId, subjectId, tutorId }) => {
  return axiosInstance.get(
    `/classes/related`,
    {
      params: {
        classId: Number(classId),
        subjectId: Number(subjectId),
        tutorId: Number(tutorId),
      },
    }
  );
};
