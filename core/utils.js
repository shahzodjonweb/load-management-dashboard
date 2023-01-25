import cookie from "js-cookie";
import { STORAGE_KEY } from "~/core/constants";

export const getAccessToken = () => {
  let token = cookie.get(STORAGE_KEY);
  if (token) {
    return token.split(";")[0];
  }
  return "";
};
