import axios from "axios";
import { ClientError, ClientErrorCode } from "./client-error";
import { VUE_APP_API_URL } from "~/core/constants";
import { getAccessToken } from "~/core/utils";

const handleRequest = (config) => {
  const accessToken = getAccessToken();
  if (config.headers && accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

const handleRequestError = (error) => {
  return Promise.reject(error);
};

const handleResponse = (response) => {
  if (response.status === 204) return null;
  return response.data;
};

const handleResponseError = (error) => {
  try {
    if (!error.response || !error.response.status) {
      throw new ClientError({
        code: ClientErrorCode.NETWORK_FAILURE,
        originalError: error,
      });
    }

    if (error.response.status === 401) {
      throw new ClientError({
        code: ClientErrorCode.UNAUTHENTICATED,
        originalError: {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
        },
      });
    }

    if (error.response.status === 403) {
      throw new ClientError({
        code: ClientErrorCode.UNAUTHORIZED,
        originalError: error,
      });
    }

    throw new ClientError({
      code: ClientErrorCode.UNEXPECTED,
      originalError: error,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.params = {};

const api = axios.create({
  baseURL: VUE_APP_API_URL,
});

api.interceptors.request.use(handleRequest, handleRequestError);
api.interceptors.response.use(handleResponse, handleResponseError);

export default api;
