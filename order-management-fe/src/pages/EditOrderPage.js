import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import { getOrder, updateOrder } from "../api/orderApi";
import { toast } from "react-toastify";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrder(id);
        setOrderData(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const handleSubmit = async (updatedData) => {
    try {
      const updatedOrder = await updateOrder(id, updatedData);
      toast.success(`Order #${updatedOrder.id} updated!`);
      navigate("/"); 
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!orderData) return <p>Order not found.</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <OrderForm initialData={orderData} onSubmit={handleSubmit} />
    </div>
  );
}
