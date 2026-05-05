
import { createContext,useContext,useEffect,useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  // 🔥 fetch logged in user
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 logout
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
    } catch (error) {
      Swal.fire("Error","Failed to logout","error");
    }
  };

  // 🔥 auto run on app load
  useEffect(() => {
    fetchUser();
  },[]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 custom hook
export const useAuth = () => useContext(AuthContext);