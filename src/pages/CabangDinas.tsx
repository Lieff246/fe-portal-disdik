import { useParams, Navigate } from "react-router-dom";
import { CABANG_DATA } from "@/types";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const CabangDinas = () => {
  const { id } = useParams();
  const cabangConfig = CABANG_DATA.find((c) => c.id === Number(id));

  if (!cabangConfig) {
    return <Navigate to="/" />;
  }

  return <DashboardLayout />;
};
