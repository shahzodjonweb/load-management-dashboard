export const ClientErrorCode = {
  UNEXPECTED: "UNEXPECTED",
  NETWORK_FAILURE: "NETWORK_FAILURE",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
};

const MESSAGES = {
  [ClientErrorCode.UNEXPECTED]: "Unexpected error happen.",
  [ClientErrorCode.NETWORK_FAILURE]:
    "Fail to reach server. Please check your network connection.",
  [ClientErrorCode.UNAUTHENTICATED]:
    "Your authentication seems expired. Please try login again.",
  [ClientErrorCode.UNAUTHORIZED]:
    "You are not allowed with this. Please try with another account.",
  [ClientErrorCode.BAD_REQUEST]: "Wrong request format.",
  [ClientErrorCode.UNDEFINED_ERROR]: "",
};

export const ClientErrorUtil = (() => {
  const getMessage = (code) =>
    MESSAGES[code] || MESSAGES[ClientErrorCode.UNEXPECTED];

  return Object.freeze({
    getMessage,
  });
})();

export class ClientError extends Error {
  code;
  message;
  originalError;

  constructor({ code, message, originalError }) {
    super();
    this.code = code;
    this.message = message || ClientErrorUtil.getMessage(code);
    this.originalError = originalError;
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}
