const API_URL = `${process.env.REACT_APP_API_URL}/orders`;

// --- Read all orders ---
export const getOrders = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

// --- Read one order ---
export const getOrder = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch order ${id}: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

// --- Create order ---
export const createOrder = async (orderData) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error(`Failed to create order: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Create failed:", error);
    throw error;
  }
};

// --- Update order ---
export const updateOrder = async (id, orderData) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error(`Failed to update order ${id}: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

// --- Delete order ---
export const deleteOrder = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete order ${id}: ${res.status}`);
    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};
