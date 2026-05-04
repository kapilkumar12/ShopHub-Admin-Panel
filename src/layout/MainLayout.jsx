import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    const [open, setOpen] = useState(false);
  return (
    <div className="flex">

      <Sidebar open={open} setOpen={setOpen} />

      {/* Content */}
      <div className="flex-1 min-h-screen bg-gray-100">
       <Navbar setOpen={setOpen} />

        <div className="p-6 lg:ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
}