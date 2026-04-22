export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const token = localStorage.getItem("token");
    let fetchInit = init || {};

    if (token) {
      fetchInit.headers = {
        ...fetchInit.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await originalFetch(input, fetchInit);

      if (response.status === 401 && !input.toString().includes('/login')) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }

      return response;
    } catch (error) {
      console.error("Fetch error interceptor:", error);
      throw error;
    }
  };
};
