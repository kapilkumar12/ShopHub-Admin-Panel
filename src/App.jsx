import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import OrderDetails from "./pages/OrderDetails";
import Register from "./pages/Register";
import VerifyOtp from "./components/VerifyOtp";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import Users from "./pages/Users";
import Sliders from "./pages/Sliders";
import AddSliders from "./pages/AddSliders";
import EditSlider from "./pages/EditSliders";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            element={
              <AdminRoute>
                <MainLayout />
              </AdminRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProducts />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/sliders" element={<Sliders />} />
            <Route path="/sliders/add" element={<AddSliders />} />
            <Route path="/sliders/edit/:id" element={<EditSlider />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;