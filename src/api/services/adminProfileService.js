import axiosInstance from '../client/axios';

export const fetchAdminProfile = () => axiosInstance.get('/admin/profile');

export const updateAdminProfile = (payload) => axiosInstance.put('/admin/profile', payload);
