import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import BrandDashboard from "./pages/BrandDashboard";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import BrandOrders from "./pages/BrandOrders";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Protected Routes for Auth Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Customer Routes */}
            <Route element={<ProtectedRoute roles={["CUSTOMER"]} />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<MyOrders />} />
            </Route>

            {/* Brand Routes */}
            <Route path="/brand/dashboard" element={
              <ProtectedRoute roles={["BRAND"]}>
                <BrandDashboard />
              </ProtectedRoute>
            } />
            <Route path="/brand/orders" element={
              <ProtectedRoute roles={["BRAND"]}>
                <BrandOrders />
              </ProtectedRoute>
            } />
            <Route path="/brand/create" element={
              <ProtectedRoute roles={["BRAND"]}>
                <CreateProduct />
              </ProtectedRoute>
            } />
            <Route path="/brand/edit/:id" element={
              <ProtectedRoute roles={["BRAND"]}>
                <EditProduct />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
        </Routes>
      </main>
      {/* <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MarketNest. All rights reserved.
        </div>
      </footer> */}
    </div>
  );
}

export default App;