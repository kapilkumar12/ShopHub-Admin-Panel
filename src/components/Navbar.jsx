import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ setOpen }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <div className="bg-white shadow px-4 py-3 flex justify-between items-center lg:ml-64">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-xl"
        >
          ☰
        </button>

        <h2 className="text-lg font-semibold">
          Admin Dashboard
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <div className="hidden sm:block font-medium">
          {user?.name}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}