import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed lg:fixed z-50 top-0 left-0 h-screen w-64 bg-gray-900 text-white p-5 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <h2 className="text-2xl font-bold mb-8">Admin</h2>

        <nav className="space-y-3">
          <NavItem to="/" label="📊 Dashboard" />
          <NavItem to="/users" label="👤 Users" />
          <NavItem to="/orders" label="📦 Orders" />
          <NavItem to="/products" label="🛍️ Products" />
          <NavItem to="/sliders" label="🎚️ Sliders" />
          <NavItem to="/reviews" label="💬 Reviews" />
        </nav>
      </div>
    </>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded transition ${
          isActive
            ? "bg-blue-500"
            : "hover:bg-gray-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}