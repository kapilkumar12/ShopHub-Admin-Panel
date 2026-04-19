
import { BrowserRouter,Routes,Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import OrderDetails from "./pages/OrderDetails";
import Register from "./pages/Register";
import VerifyOtp from "./components/VerifyOtp";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";

function App() {


  return (
    <>
<Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
             <Route path="/products" element={<Products />} />
             <Route path="/products/add" element={<AddProducts />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
