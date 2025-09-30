import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrdersPage from "./pages/OrderPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
