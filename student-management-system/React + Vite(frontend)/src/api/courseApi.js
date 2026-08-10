import axiosClient from './axiosClient';

export const listCourses = () =>
  axiosClient.get('/courses').then((res) => res.data);

export const getCourse = (id) =>
  axiosClient.get(`/courses/${id}`).then((res) => res.data);

export const createCourse = (payload) =>
  axiosClient.post('/courses', payload).then((res) => res.data);

export const updateCourse = (id, payload) =>
  axiosClient.put(`/courses/${id}`, payload).then((res) => res.data);

export const deleteCourse = (id) =>
  axiosClient.delete(`/courses/${id}`).then((res) => res.data);
