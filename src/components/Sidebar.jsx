import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-8">Admin</h2>

      <nav className="space-y-4">
        <NavItem to="/" label="📊 Dashboard" />
        <NavItem to="/users" label="👤 Users" />
        <NavItem to="/orders" label="📦 Orders" />
        <NavItem to="/products" label="📦 Products" />
        <NavItem to="/sliders" label="🎚️ Sliders" />
      </nav>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded ${
          isActive
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}