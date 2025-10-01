import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";

export default function OrderForm({ initialData, onSubmit, cancel }) {
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setProductName(initialData.productName);
      setQuantity(initialData.quantity);
      setPrice(initialData.price);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customerName,
      productName,
      quantity: Number(quantity),
      price: Number(price),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: 400 }}>
      <TextField
        label="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
        Submit
      </Button>
      <Button variant="outlined" color="secondary" style={{ marginTop: 10 }} onClick={cancel}>
        Cancel
      </Button>
    </form>
  );
}
