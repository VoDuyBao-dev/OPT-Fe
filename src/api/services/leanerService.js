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
      avatarUrl: data.avatarUrl ?? data.avatar ?? "",
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

  const result = res.data?.result || {};
  const content = result?.content || [];

  return {
    items: content,
    pagination: {
      page: result?.pageable?.pageNumber ?? page,
      size: result?.pageable?.pageSize ?? size,
      totalItems: result?.totalElements ?? content.length,
      totalPages: result?.totalPages ?? 1,
    },
  };
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

// ============================
// 7. Lấy danh sách filter
// ============================

export const getTutorFilters = async () => {
  const res = await axiosInstance.get(
    "/learner/tutors/filters"
  );
  return res.data?.result || res.data;
};

// ============================
// 8. Tìm gia sư theo filter
// ============================
export const searchTutorsByFilter = async ({
  subjectId,
  educationalLevel,
} = {}) => {
  const res = await axiosInstance.get(
    "/learner/tutors/search-filters",
    {
      params: {
        subjectId: subjectId || undefined,
        educationalLevel: educationalLevel || undefined,
      },
    }
  );

  return res.data?.result || res.data || [];
};


// ============================
// 9. Tìm gia sư theo keyword
// ============================

export const searchTutorsByKeyword = async (keyword) => {
  const res = await axiosInstance.get(
    "/learner/tutors/search",
    {
      params: { q: keyword },
    }
  );

  return res.data?.result || res.data || [];
};

// ========================
// 10. Ebooks
// ========================
export const getAllEbooks = async () => {
  const res = await axiosInstance.get("/learner/ebooks");
  const result = res.data?.result || {};
  const items = result.items || result.content || [];

  return {
    items,
    pagination: {
      page: result.page ?? result.pageable?.pageNumber ?? 0,
      size: result.size ?? result.pageable?.pageSize ?? items.length,
      totalItems: result.totalItems ?? result.totalElements ?? items.length,
      totalPages: result.totalPages ?? 1,
    },
  };
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
  const result = res.data?.result || {};
  const items = result.items || result.content || [];
  // console.log('searchEbooks result:', result);
  return {
    items,
    pagination: {
      page: result.page ?? result.pageable?.pageNumber ?? page,
      size: result.size ?? result.pageable?.pageSize ?? size,
      totalItems: result.totalItems ?? result.totalElements ?? items.length,
      totalPages: result.totalPages ?? 1,
    },
  };
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
export const getTutorAvailabilities = async (tutorId, fromDate, toDate) => {
  const res = await axiosInstance.get(
    `/learner/tutor-avails/${tutorId}/availabilities`,
    {
      params: { fromDate, toDate },
    }
  );

  return res.data?.result || [];
};

// ========================
// 16. Tạo yêu cầu học thử / chính thức
// ========================
export const createTrialRequest = (payload) =>
  axiosInstance.post("/learner/class-requests/create-trial-request", payload);

export const createOfficialRequest = (payload) =>
  axiosInstance.post("/learner/class-requests/create-official-request", payload);

// ========================
// 17. Preview chi phí/lịch trước khi thanh toán
// ========================
// Backend trả về: totalAmount, totalSessions, tutorName, subjectName,
// startDate, endDate, schedules[], additionalNotes, classRequestId (nếu có)
export const previewOfficialClass = async (payload) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug('Calling previewOfficialClass ->', {
      url: '/learner/class-requests/official/preview',
      payload,
      tokenPresent: !!localStorage.getItem('token'),
    });
  }

  try {
    const res = await axiosInstance.post(
      "/learner/class-requests/official/preview",
      payload,
    );

    if (process.env.NODE_ENV === 'development') {
      console.debug('previewOfficialClass response data:', res?.data);
    }

    return res;
  } catch (err) {
    // Log detailed request + response info to help reproduce
    try {
      console.error('previewOfficialClass error status:', err?.response?.status);
      console.error('previewOfficialClass response data:', JSON.stringify(err?.response?.data, null, 2));
      console.error('previewOfficialClass request data:', err?.config?.data);
      console.error('previewOfficialClass request headers:', err?.config?.headers);

      // Print a curl command (with redacted token) that you can copy/paste to reproduce
      const hdrs = err?.config?.headers || {};
      const authHeader = hdrs.Authorization ? "-H \"Authorization: Bearer <TOKEN>\" " : '';
      const contentType = hdrs['Content-Type'] ? `-H \"Content-Type: ${hdrs['Content-Type']}\" ` : '';
      const curlBody = typeof err?.config?.data === 'string' ? err.config.data : JSON.stringify(err?.config?.data);
      console.error('cURL (redacted):', `curl -X POST ${authHeader}${contentType}\"${axiosInstance.defaults.baseURL}/learner/class-requests/official/preview\" -d '${curlBody}'`);
    } catch (e) {
      console.error('Error while logging previewOfficialClass error details', e);
    }

    throw err;
  }
};


// ========================
// 18. Tạo link thanh toán VNPay
// ========================
export const createVnpayPaymentLink = ({ classRequestId, amount }) =>
  axiosInstance.post(
    "/payment/vnpay/create",
    { classRequestId, amount },
  );



