import axiosClient from './axiosClient';

export const login = (username, password) =>
  axiosClient.post('/auth/login', { username, password }).then((res) => res.data);

export const register = (username, email, password, role) =>
  axiosClient.post('/auth/register', { username, email, password, role }).then((res) => res.data);
