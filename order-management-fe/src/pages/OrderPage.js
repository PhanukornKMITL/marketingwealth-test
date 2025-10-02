import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getOrders, deleteOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Slider, Box, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from 'react-toastify';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { logout } from "../api/authApi";

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState(['0', '1000']);
    const [sortOrder, setSortOrder] = useState('newest');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            const data = await getOrders();
            setOrders(data);
            setAllOrders(data);

            // กำหนดค่า default ราคาไว้ให้ slider filter
            const prices = data.map(o => o.price);
            if (prices.length > 0) {
                setPriceRange([Math.min(...prices), Math.max(...prices)]);
            }
        }
        fetchOrders();
    }, []);

    const handleFilterToggle = () => setFilterOpen(!filterOpen);

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue.map(String));
        applyFilters(newValue, sortOrder);
    };
    const handleMinChange = (e) => {
        const newMin = e.target.value;
        setPriceRange([newMin, priceRange[1]]);
        if (newMin !== '' && priceRange[1] !== '') {
            applyFilters([Number(newMin), Number(priceRange[1])], sortOrder);
        }
    };

    const handleMaxChange = (e) => {
        const newMax = e.target.value;
        setPriceRange([priceRange[0], newMax]);
        if (newMax !== '' && priceRange[0] !== '') {
            applyFilters([Number(priceRange[0]), Number(newMax)], sortOrder);
        }
    };
    const handleSortChange = (event) => {
        const newSort = event.target.value;
        setSortOrder(newSort);
        applyFilters(priceRange, newSort);
    };

    const applyFilters = (price, sort, start, end) => {
        let filtered = allOrders.filter(o => o.price >= price[0] && o.price <= price[1]);

        // filter date
        if (start) filtered = filtered.filter(o => dayjs(o.createdAt).isSameOrAfter(start, 'day'));
        if (end) filtered = filtered.filter(o => dayjs(o.createdAt).isSameOrBefore(end, 'day'));

        // sort by date
        if (sort === 'newest')
            filtered.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
        else
            filtered.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());


        setOrders(filtered);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }


    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "customerName", headerName: "Customer", width: 200 },
        { field: "productName", headerName: "Product Name", width: 200 },
        { field: "quantity", headerName: "Quantity", width: 130 },
        { field: "price", headerName: "Price", width: 130 },
        { field: "total", headerName: "Total", width: 130 },
        { field: "createdAt", headerName: "Order Date", width: 130},
        {
            field: "actions",
            headerName: "",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <IconButton color="primary" onClick={() => navigate(`/edit/${params.row.id}`)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={async () => {
                        if (!window.confirm(`Delete order ${params.row.id}?`)) return;
                        try {
                            await deleteOrder(params.row.id);
                            setOrders(prev => prev.filter(o => o.id !== params.row.id));
                            setAllOrders(prev => prev.filter(o => o.id !== params.row.id));
                            toast.success(`Order #${params.row.id} deleted!`);
                        } catch {
                            toast.error("Failed to delete order.");
                        }
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
            <Button
                variant="contained"
                color="error"  // สีแดง
                sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                }}
                onClick={handleLogout}
            >
                Logout
            </Button>
            
            <h2>Orders Dashboard</h2>

            <div style={{ width: "80%", maxWidth: 800, marginBottom: 10, textAlign: "right", position: "relative" }}>

                <div
                    style={{
                        width: "100%",
                        maxWidth: 800,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Button variant="outlined" color="secondary" onClick={handleFilterToggle}>
                        Filter
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => navigate("/add")}>
                        + Add Order
                    </Button>
                </div>

                {filterOpen && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 40,
                            width: 250,
                            bgcolor: "background.paper",
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                            boxShadow: 3,
                            mt: 1,
                            zIndex: 100
                        }}
                    >
                        <p>Price: {priceRange[0]} - {priceRange[1]}</p>

                        {/* ช่องกรอกตัวเลข */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <TextField
                                label="Min"
                                type="number"
                                value={priceRange[0]}
                                onChange={handleMinChange}
                                size="small"
                            />
                            <TextField
                                label="Max"
                                type="number"
                                value={priceRange[1]}
                                onChange={handleMaxChange}
                                size="small"
                            />
                        </div>

                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                        />

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Sort</InputLabel>
                            <Select value={sortOrder} onChange={handleSortChange}>
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="oldest">Oldest</MenuItem>
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                        applyFilters(priceRange.map(Number), sortOrder, newValue, endDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => {
                                        setEndDate(newValue);
                                        applyFilters(priceRange.map(Number), sortOrder, startDate, newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                />
                            </Box>
                        </LocalizationProvider>

                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => {
                                const prices = allOrders.map(o => o.price);
                                setPriceRange([Math.min(...prices), Math.max(...prices)].map(String));
                                setSortOrder('newest');
                                setStartDate(null);
                                setEndDate(null);
                                setOrders(allOrders);
                            }}
                        >
                            Clear Filter
                        </Button>
                    </Box>
                )}
            </div>

            <DataGrid
                rows={orders}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
            />
        </div>
    );
}

export default OrdersPage;