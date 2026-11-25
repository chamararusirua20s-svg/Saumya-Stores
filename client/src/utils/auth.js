// Shared helper to safely read the auth token from localStorage OR sessionStorage
export const getAuthToken = () => {
  try {
    const local = localStorage.getItem("userInfo");
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.token) return parsed.token;
    }
    const session = sessionStorage.getItem("userInfo");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed?.token) return parsed.token;
    }
    return "";
  } catch {
    return "";
  }
};

export const authHeaders = () => ({
  ...(getAuthToken()
    ? { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    : {}),
});
