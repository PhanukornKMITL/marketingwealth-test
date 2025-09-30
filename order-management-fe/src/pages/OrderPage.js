import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getOrders, updateOrder, createOrder, deleteOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom"; // สำหรับ navigation
import { Button } from "@mui/material"; // MUI button
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { toast } from 'react-toastify';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate(); // hook สำหรับ navigate

    useEffect(() => {
        async function fetchOrders() {
            const data = await getOrders();
            setOrders(data);
        }
        fetchOrders();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "customerName", headerName: "Customer", width: 200 },
        { field: "productName", headerName: "Product Name", width: 200 },
        { field: "quantity", headerName: "Quantity", width: 130 },
        { field: "price", headerName: "Price", width: 130 },
        { field: "total", headerName: "Total", width: 130 },
        {
            field: "actions",
            headerName: "", // ไม่แสดง header
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        }

    ];

    const handleAddOrder = () => {
        navigate("/orders/new");
    };

    const handleEdit = (order) => {
        navigate(`/orders/${order.id}/edit`);
    };

    const handleDelete = async (order) => {
        if (!window.confirm(`Delete order ${order.id}?`)) return;

        try {

            await deleteOrder(order.id);
            setOrders((prev) => prev.filter((o) => o.id !== order.id));

            toast.success(`Order #${order.id} deleted!`);
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error("Failed to delete order.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <div style={{ width: "80%", maxWidth: 800 }}>
                <h2 style={{ textAlign: "center" }}>Orders Dashboard</h2>

                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                    <Button variant="contained" color="primary" onClick={handleAddOrder}>
                        + Add Order
                    </Button>
                </div>

                <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                />
            </div>
        </div>
    );
}
