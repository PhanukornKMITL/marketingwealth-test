const API_URL = `${process.env.REACT_APP_API_URL}/orders`;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

const handleResponse = async (res) => {
  if (res.status === 401) {
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
};

// --- Read all orders ---
export const getOrders = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });  
  return handleResponse(res);
};

// --- Read one order ---
export const getOrder = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
};

// --- Create order ---
export const createOrder = async (orderData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
};

// --- Update order ---
export const updateOrder = async (id, orderData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
};

// --- Delete order ---
export const deleteOrder = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 401) {
    window.location.href = "/login";
    return;
  }
  if (!res.ok) throw new Error(`Failed to delete order ${id}: ${res.status}`);
  return true;
};
