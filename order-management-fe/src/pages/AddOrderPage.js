import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import { toast } from "react-toastify";
import OrderForm from "../components/OrderForm"

export default function AddOrderPage() {
    const [customerName, setCustomerName] = useState('');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericQuantity = Number(quantity);
        const numericPrice = Number(price);

        if (isNaN(numericQuantity) || numericQuantity <= 0) {
            toast.error("Quantity must be a positive number");
            return;
        }

        if (isNaN(numericPrice) || numericPrice <= 0) {
            toast.error("Price must be a positive number");
            return;
        }

        try {
            const newOrder = await createOrder({
                customerName,
                productName,
                quantity: numericQuantity,
                price: numericPrice,
            });

            toast.success(`Order #${newOrder.id} created!`);
            navigate("/");
        } catch (error) {
            console.error("Failed to create order:", error);
            toast.error("Failed to create order.");
        }
    };


    return (
        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
            <OrderForm
                customerName={customerName}
                productName={productName}
                quantity={quantity}
                price={price}
                setCustomerName={setCustomerName}
                setProductName={setProductName}
                setQuantity={setQuantity}
                setPrice={setPrice}
                onSubmit={handleSubmit}
                cancel={() => navigate("/")}
            />
        </div>
    );
}
