import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const { user,setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await API.get('/auth/logout');
      setUser(null); 
      navigate('/login');
    } catch (error) {
      alert('Logout failed')
    }
  }

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center ml-64">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        {/* <button className="relative">
          🔔
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            3
          </span>
        </button> */}

        <div className="font-medium">{user.name}</div>
        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}