export function normalizeApiError(error) {
  if (error?.response) {
    const { status, data } = error.response;

    return {
      status,
      message: data?.message || "An unexpected error occurred.",
      errors: data?.errors || null,
      isNetworkError: false,
      isTimeout: false,
      original: error,
    };
  }

  if (error?.code === "ECONNABORTED") {
    return {
      status: null,
      message: "Request timed out. Please try again.",
      errors: null,
      isNetworkError: false,
      isTimeout: true,
      original: error,
    };
  }

  if (error?.request) {
    return {
      status: null,
      message: "Unable to reach the server. Check your connection.",
      errors: null,
      isNetworkError: true,
      isTimeout: false,
      original: error,
    };
  }

  return {
    status: null,
    message: error?.message || "An unexpected error occurred.",
    errors: null,
    isNetworkError: false,
    isTimeout: false,
    original: error,
  };
}
