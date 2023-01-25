import axios from "axios";
import api from "@/http";

import { VUE_APP_API_URL } from "~/core/constants";

export const userLogin = async (access_key) => {
  let payload = {
    access_key: access_key,
  };
  const response = await axios.post(VUE_APP_API_URL + "/google/login", payload);
  return response.data.data;
};
export const appleIdLogin = async (code) => {
  let payload = {
    code: code,
  };
  const response = await axios.post(VUE_APP_API_URL + "/apple/login", payload);
  return response.data;
};
export const emailVerify = async (url) => {
  const response = await axios.get(url);
  return response.data;
};
export const emailResend = async (payload) => {
  const data = await api.post(`/email/resend`, payload);
  return data;
};
export const forgotPassword = async (payload) => {
  const data = await api.post(`/forgot-password`, payload);
  return data;
};
export const resetPassword = async (payload) => {
  const data = await api.post(`/reset-password`, payload);
  return data;
};
export const userAccount = async () => {
  const data = await api.get(`/account`);
  return data;
};
export const userUpdate = async (payload) => {
  const data = await api.patch(`/account`, payload);
  return data;
};
export const updateCompany = async (payload) => {
  const data = await api.post(`/account/company`, payload);
  return data;
};
