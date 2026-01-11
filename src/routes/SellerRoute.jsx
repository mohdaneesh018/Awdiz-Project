import { Navigate, Outlet } from "react-router-dom";

const SellerRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "seller") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;