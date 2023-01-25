import api from "@/http";

export const getLoads = async (payload) => {
  const params = new URLSearchParams(payload).toString();
  const data = await api.get(`/loads/?${params}`);
  return data;
};

export const getLoad = async (id) => {
  const data = await api.get(`/loads/${id}`);
  return data;
};

export const createLoad = async (payload) => {
  const data = await api.post("/loads", payload);
  return data;
};

export const updateLoad = async (id, payload) => {
  const data = await api.patch(`/loads/${id}`, payload);
  return data;
};
export const deleteLoad = async (id) => {
  const data = await api.delete(`/loads/${id}`);
  return data;
};

export const loadOfferActions = async (id, payload) => {
  const data = await api.post(`/loads/${id}/counter-rate`, payload);
  return data;
};

export const registerUser = async (payload) => {
  const data = await api.post(`/register`, payload);
  return data;
};
export const loginUser = async (payload) => {
  const data = await api.post(`/login`, payload);
  return data;
};
export const deleteUser = async () => {
  const data = await api.delete(`/account/delete`);
  return data;
};
export const updateLocation = async (id, payload) => {
  const data = await api.patch(`/location/${id}`, payload);
  return data;
};
