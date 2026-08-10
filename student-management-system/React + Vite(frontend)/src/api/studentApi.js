import axiosClient from './axiosClient';

export const listStudents = (page = 0, size = 10, search = '') =>
  axiosClient.get('/students', { params: { page, size, search } }).then((res) => res.data);

export const getStudent = (id) =>
  axiosClient.get(`/students/${id}`).then((res) => res.data);

export const createStudent = (payload) =>
  axiosClient.post('/students', payload).then((res) => res.data);

export const updateStudent = (id, payload) =>
  axiosClient.put(`/students/${id}`, payload).then((res) => res.data);

export const deleteStudent = (id) =>
  axiosClient.delete(`/students/${id}`).then((res) => res.data);

export const enrollStudent = (studentId, courseId) =>
  axiosClient.post(`/students/${studentId}/enroll/${courseId}`).then((res) => res.data);
