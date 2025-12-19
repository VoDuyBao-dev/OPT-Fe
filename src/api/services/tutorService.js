import axiosInstance from "../client/axios";

// ========================
// 1. Lấy thông tin gia sư (Tutor Info)
// ========================
export const getTutorInfo = async () => {
  try {
    // Gọi endpoint /tutors/home/info (không cần tutorId)
    const response = await axiosInstance.get('/tutors/home/info');
    return response.data.result; // Trả về tutor info đầy đủ
  } catch (error) {
    console.error('Error fetching tutor info:', error);
    throw error;
  }
};

// ========================
// 2. Lấy tổng số buổi học trong tuần (Weekly Schedule)
// ========================
export const getWeeklyClassCount = async () => {
  try {
    const response = await axiosInstance.get('/tutors/home/schedule');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching weekly classes:', error);
    throw error;
  }
};

// ========================
// 3. Lấy số yêu cầu mới (New Requests Count)
// ========================
export const getNewRequestsCount = async () => {
  try {
    const response = await axiosInstance.get('/tutors/home/requests/count');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching new requests:', error);
    throw error;
  }
};

// ========================
// 4. Lấy danh sách lớp đang dạy (Active Classes List)
// ========================
export const getActiveClasses = async (page = 0, size = 5) => {
  try {
    const response = await axiosInstance.get('/tutors/home/classes', {
      params: { page, size },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching active classes:', error);
    throw error;
  }
};


// ========================
// 5. Lấy thông tin cá nhân gia sư (Tutor Profile Info)
// ========================
export const fetchPersonalInfo = async () => {
  try {
    const response = await axiosInstance.get('/tutors/profile/personal-info');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching personal info:', error);
    throw error;
  }
};

// ========================
// 6. Cập nhật thông tin cá nhân gia sư (Update Tutor Profile Info)
// ========================
export const updatePersonalInfo = async (payload) => {
  try {
    const response = await axiosInstance.put('/tutors/profile/personal-info', payload);
    return response.data.result;
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
};

// ========================
// 7. Lấy thông tin trình độ học vấn của gia sư (Tutor Education Info)
// ========================
export const fetchEducationInfo = async () => {
  try {
    const response = await axiosInstance.get('/tutors/profile/education');
    console.log('fetchEducationInfo response:', response.data?.result); 
    return response.data.result;
  } catch (error) {
    console.error('Error fetching education info:', error);
    throw error;
  }
};
// ========================
// 8. Cập nhật thông tin trình độ học vấn của gia sư (Update Tutor Education Info)
// ========================
export const updateEducationInfo = async (data, files = []) => {
  try {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    files.forEach(file => {
      form.append('certificateFiles', file);
    });

    const response = await axiosInstance.put('/tutors/profile/education', form);
    console.log('updateEducationInfo response:', response.data?.result);
    return response.data?.result;
  } catch (error) {
    console.error('Error updating education info:', error?.response?.data || error);
    throw error;
  }
};
// ========================
// 9. Lấy thông tin môn dạy của gia sư (Tutor Subjects Info)
// ========================
export const fetchSubjectsInfo = async () => {
  try {
    const response = await axiosInstance.get('/tutors/profile/subjects');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching subjects info:', error);
    throw error;
  }
};
// ========================
// 10. Cập nhật thông tin môn dạy của gia sư (Update Tutor Subjects Info)
// ========================
export const updateSubjectsInfo = async (payload) => {
  try {
    const response = await axiosInstance.put('/tutors/profile/subjects', payload);
    return response.data.result;
  } catch (error) {
    console.error('Error updating subjects info:', error);
    throw error;
  }
};
// ========================
// 11. Lấy thông tin đánh giá của gia sư (Tutor ratings)
// ========================
export const fetchTutorRatings = async () => {
  try {
    const response = await axiosInstance.get('/tutors/profile/ratings');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching tutor ratings:', error);
    throw error;
  }
}
// ========================
// 12. cập nhật avatar gia sư (Update Tutor Avatar)
// ========================
export const updateTutorAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatarFile', avatarFile);
    const response = await axiosInstance.put('/tutors/profile/avatar', formData);
    return response.data.result;
  } catch (error) {
    console.error('Error updating tutor avatar:', error);
    throw error;
  }
};

// Quản lý lịch rảnh TUTOR
// ========================
// 13. xem lịch rảnh (Get Tutor Availability Schedule)
export const getTutorAvailability = async () => {
  try {
    const response = await axiosInstance.get('/tutors/profile/availability');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching tutor availability:', error);
    throw error;
  }
};
//=======================
// 13. thêm lịch rảnh (Add Tutor Availability Slot)
export const addTutorAvailabilitySlot = async (slotData) => {
  try {
    const response = await axiosInstance.post('/tutors/profile/availability', slotData);
    return response.data.result;
  } catch (error) {
    console.error('Error adding tutor availability slot:', error);
    throw error;
  }
};
// ========================
// 14. cập nhật lịch rảnh (Update Tutor Availability Schedule)
// ========================
export const updateTutorAvailability = async (availabilitySlots) => {
  try {
    const response = await axiosInstance.put('/tutors/profile/availability', { slots: availabilitySlots });
    return response.data.result;
  } catch (error) {
    console.error('Error updating tutor availability:', error);
    throw error;
  }
};
// ========================
// 15. Xóa lịch rảnh (Delete Tutor Availability Slot)
// ========================
export const deleteTutorAvailabilitySlot = async (slotId) => {
  try {
    const response = await axiosInstance.delete(`/tutors/profile/availability/${slotId}`);
    return response.data.result;
  } catch (error) {
    console.error('Error deleting tutor availability slot:', error);
    throw error;
  }
};

// ========================
// Lịch rảnh - API chuẩn hóa dùng trong UI
// ========================
export const fetchAvailabilities = async () => {
  try {
    const response = await axiosInstance.get('/tutors/schedule/availability');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching tutor availability list:', error);
    throw error;
  }
};

export const createAvailability = async ({ dayOfWeek, startTime, endTime, status }) => {
  try {
    const payload = { dayOfWeek, timeRange: `${startTime}-${endTime}`, status };
    const response = await axiosInstance.post('/tutors/schedule/availability', payload);
    return response.data.result;
  } catch (error) {
    console.error('Error creating tutor availability:', error);
    throw error;
  }
};

export const updateAvailability = async (slotId, { startTime, endTime, status }) => {
  try {
    const payload = { timeRange: `${startTime}-${endTime}`, status };
    const response = await axiosInstance.put(`/tutors/schedule/availability/${slotId}`, payload);
    return response.data.result;
  } catch (error) {
    console.error('Error updating tutor availability:', error);
    throw error;
  }
};

export const deleteAvailability = async (slotId) => {
  try {
    const response = await axiosInstance.delete(`/tutors/schedule/availability/${slotId}`);
    return response.data.result;
  } catch (error) {
    console.error('Error deleting tutor availability:', error);
    throw error;
  }
};

export const fetchTeachingSchedule = async () => {
  try {
    const response = await axiosInstance.get('/tutors/schedule/teaching');
    console.log('fetchTeachingSchedule response:', response.data?.result);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching teaching schedule:', error);
    throw error;
  }
};

// ========================
// Yêu cầu từ người học gửi cho tutor
// ========================
const mapStatus = (status) => {
  if (!status || status === 'all') return undefined;
  const s = String(status).toLowerCase();
  if (s === 'pending') return 'PENDING';
  if (s === 'accepted') return 'CONFIRMED';
  if (s === 'rejected') return 'CANCELLED';
  return s.toUpperCase();
};

const mapType = (type) => {
  if (!type || type === 'all') return undefined;
  const t = String(type).toLowerCase();
  if (t === 'trial') return 'TRIAL';
  if (t === 'official') return 'OFFICIAL';
  return t.toUpperCase();
};

export const fetchTutorRequests = async ({ status, type, keyword, page = 0, size = 10 } = {}) => {
  try {
    const params = { page, size };
    const beStatus = mapStatus(status);
    const beType = mapType(type);
    if (beStatus) params.status = beStatus;
    if (beType) params.type = beType;
    if (keyword) params.keyword = keyword;

    const response = await axiosInstance.get('/tutors/requests', { params });
    return response.data.result; // Spring Page
  } catch (error) {
    console.error('Error fetching tutor requests:', error);
    throw error;
  }
};

export const acceptTutorRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(`/tutors/requests/${requestId}/accept`);
    return response.data.result; // { requestStatus, classStatus, requestId, classId }
  } catch (error) {
    console.error('Error accepting tutor request:', error);
    throw error;
  }
};

export const rejectTutorRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(`/tutors/requests/${requestId}/reject`);
    return response.data.result;
  } catch (error) {
    console.error('Error rejecting tutor request:', error);
    throw error;
  }
};