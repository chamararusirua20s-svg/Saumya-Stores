import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Context
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { CartProvider, CartContext } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { LocationProvider } from "./context/LocationContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import LocationModal from "./components/LocationModal";
import BottomNav from "./components/BottomNav";
import AuthRequiredModal from "./components/AuthRequiredModal";

// Customer Pages
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordOtp from "./pages/ForgotPasswordOtp";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetails from "./pages/OrderDetails";
import MyOrders from "./pages/MyOrders";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import CategoryManagement from "./pages/admin/CategoryManagement";
import OrderList from "./pages/admin/OrderList";
import CustomerList from "./pages/admin/CustomerList";
import Reports from "./pages/admin/Reports";
import ContentManagement from "./pages/admin/ContentManagement";
import BackgroundManagement from "./pages/admin/BackgroundManagement";

// Protected Route Component for Admin
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (isAdmin && user.role !== "admin") return <Navigate to="/" />;
  return children;
};

// Protected Route Component for Checkout & User Account
const CustomerProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error("Please log in or create an account to continue shopping.", { id: "auth-toast" });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

// Layout for Customer Pages (with Navbar + Footer + Drawers + Mobile Bottom Nav)
const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleOpenSearch = () => {
    navigate("/shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAF5] text-gray-800">
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <Footer />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <LocationModal />
      <BottomNav onOpenSearch={handleOpenSearch} />
      <AuthRequiredModal />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  toastOptions={{
                    style: {
                      borderRadius: "16px",
                      background: "#14532D",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "13px",
                      boxShadow: "0 10px 25px -5px rgba(20, 83, 45, 0.25)",
                    },
                  }}
                />
                <Routes>
                  {/* ── Public Supermarket & Storefront Routes ── */}
                  <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                  <Route path="/home" element={<CustomerLayout><Home /></CustomerLayout>} />
                  <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
                  <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
                  <Route
                    path="/cart"
                    element={
                      <CustomerProtectedRoute>
                        <CustomerLayout><Cart /></CustomerLayout>
                      </CustomerProtectedRoute>
                    }
                  />
                  <Route path="/landing" element={<CustomerLayout><Landing /></CustomerLayout>} />

                {/* ── Public Auth Routes ── */}
                <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
                <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
                <Route path="/verify-email" element={<CustomerLayout><OtpVerification /></CustomerLayout>} />
                <Route path="/forgot-password" element={<CustomerLayout><ForgotPassword /></CustomerLayout>} />
                <Route path="/forgot-password/verify" element={<CustomerLayout><ForgotPasswordOtp /></CustomerLayout>} />
                <Route path="/reset-password" element={<CustomerLayout><ResetPassword /></CustomerLayout>} />

                {/* ── Protected Customer Checkout & Orders ── */}
                <Route
                  path="/shipping"
                  element={
                    <CustomerProtectedRoute>
                      <CustomerLayout><Shipping /></CustomerLayout>
                    </CustomerProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <CustomerProtectedRoute>
                      <CustomerLayout><Payment /></CustomerLayout>
                    </CustomerProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:id"
                  element={
                    <CustomerProtectedRoute>
                      <CustomerLayout><OrderSuccess /></CustomerLayout>
                    </CustomerProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <CustomerProtectedRoute>
                      <CustomerLayout><OrderDetails /></CustomerLayout>
                    </CustomerProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <CustomerProtectedRoute>
                      <CustomerLayout><MyOrders /></CustomerLayout>
                    </CustomerProtectedRoute>
                  }
                />

                {/* ── Admin Routes (nested under AdminLayout) ── */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/add" element={<ProductForm />} />
                  <Route path="products/edit/:id" element={<ProductForm />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="backgrounds" element={<BackgroundManagement />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </LocationProvider>
    </AuthModalProvider>
  </AuthProvider>
);
}

export default App;
