import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }){
    const isLoggedIn = true;
    if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}