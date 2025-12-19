import axiosInstance from "../client/axios";


// ========================
// 1. Lấy thông tin gia sư (Tutor Info)
// ========================
export const getLearnerProfile = async () => {
  try {
    const res = await axiosInstance.get(
      "/learner/profile",
      { timeout: 15000 }
    );

    const data = res.data?.result;

    if (!data) {
      console.error("❌ Không có result từ backend");
      return null;
    }

    return {
      fullName: data.fullName ?? "",
      phoneNumber: data.phoneNumber ?? "",
      address: data.address ?? "",
      email: data.email ?? "",
    };
  } catch (err) {
    console.error("❌ Get learner profile error:", err.response?.data || err);
    throw err;
  }
};

// ========================
// 2. Cập nhật profile learner
// ========================
export const updateLearnerProfile = async (payload) => {
  const res = await axiosInstance.put(
    "/learner/profile",
    payload,
    { timeout: 15000 }
  );

  return res.data;
};

// ========================
// 3. Lấy danh sách lớp đã học
// ========================
export const getCompletedClasses = async () => {
  try {
    const res = await axiosInstance.get(
      "/learner/classes/getAll-classesCompleted",
      { timeout: 15000 }
    );
    return res.data.result || [];
    } catch (err) {
      console.error("❌ Get learner classes error:", err.response?.data || err);
      throw err;
    }
}

// ========================
// 4. Gửi đánh giá cho lớp học
// ========================

export const submitClassReview = async ({
  classId,
  rating,
  comment,
  image,
}) => {
  const formData = new FormData();
  formData.append("rating", rating);
  formData.append("comment", comment);

  if (image) {
    formData.append("image", image);
  }

  const res = await axiosInstance.post(
    `/learner/classes/${classId}/review`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};


// ========================
// 5. Lấy danh sách yêu cầu của learner
// ========================
export const getLearnerRequests = async (page = 0, size = 10) => {
  const res = await axiosInstance.get("/learner/class-requests", {
    params: { page, size },
  });

  return res.data?.result?.content ?? [];
};

// ========================
// 6. Lấy lịch học của learner theo khoảng thời gian
// ========================


export const getLearnerCalendar = async (from, to) => {
  const res = await axiosInstance.get(
    "/learner/calendar", 
    {
      params: { from, to },
    }
  );

  return res.data?.result || [];
};

// ========================
// 7. Lấy dữ liệu filter gia sư
// ========================

export const getTutorFilters = async () => {
  const res = await axiosInstance.get("/learner/tutors/filters");
  return res.data.result;
};

// =====================
// 8. Tìm kiếm gia sư (theo filter)
// =====================
export const searchTutorsByFilter = async (params) => {
  const res = await axiosInstance.get("/learner/tutors/search-filters", { params });
  return res.data.result;
};

// =====================
// 9. Tìm kiếm gia sư (theo từ khóa)
// =====================
export const searchTutorsByKeyword = async (q) => {
  const res = await axiosInstance.get("/learner/tutors/search", {
    params: { q },
  });
  return res.data.result;
};

// ========================
// 10. Ebooks
// ========================
export const getAllEbooks = async () => {
  const res = await axiosInstance.get("/learner/ebooks");
  return res.data.result;
};

// ========================
// 11. Lọc ebooks theo type + phân trang
// ========================
export const searchEbooks = async ({ type, page = 0, size = 5 }) => {
  const res = await axiosInstance.get(
    "/learner/ebooks/search",
    {
      params: { type, page, size },
    }
  );
  return res.data.result;
};

// =======================
// 12. Lấy chi tiết gia sư
// =======================
export const getTutorDetail = (tutorId) => {
  return axiosInstance.get(`/tutors/tutorDetail/${tutorId}`);
};

// ========================
// 13. Đánh giá lớp đã học
// ========================

export const createRating = (payload) => {
  return axiosInstance.post(
    "/learner/ratings/create-rating",
    payload
  );
};


// ========================
// 15. Lấy lịch trống của gia sư
// ========================
export const getTutorAvailabilities = (tutorId, fromDate, toDate) => {
  return axiosInstance.get(
    `/learner/tutor-avails/${tutorId}/availabilities`,
    {
      params: { fromDate, toDate }
    }
  );
};

// ========================
// 16. Tạo yêu cầu học thử / chính thức
// ========================
export const createTrialRequest = (payload) =>
  axiosInstance.post("/learner/class-requests/create-trial-request", payload);

export const createOfficialRequest = (payload) =>
  axiosInstance.post("/learner/class-requests/create-official-request", payload);



