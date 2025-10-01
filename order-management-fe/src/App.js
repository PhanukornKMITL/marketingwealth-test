import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OrdersPage from "./pages/OrderPage";
import AddOrderPage from "./pages/AddOrderPage";
import EditOrderPage from "./pages/EditOrderPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/add" element={<AddOrderPage/>}/>
        <Route path="/edit/:id" element={<EditOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
