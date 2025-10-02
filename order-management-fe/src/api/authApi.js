const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


const handleResponse = async (res) => {

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const msg = errorData?.message ?? `Request failed: ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
  }

  return res.json();
};


// --- Login ---
export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

export const register = async (username, password, confirmPassword) => {

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, confirmPassword }),
  });


  return handleResponse(res);
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
