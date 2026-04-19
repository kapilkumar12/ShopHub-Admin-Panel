import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-6 ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
}