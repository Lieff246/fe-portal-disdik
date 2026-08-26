import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle, ShieldCheck } from "lucide-react";

/**
 * AdminBar — floating bar di bagian atas halaman publik.
 * Hanya muncul kalau user sudah login sebagai admin.
 * Tidak mengganggu tampilan publik sama sekali.
 */
export const AdminBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const roleLabel: Record<string, string> = {
    admin_provinsi: "Admin Provinsi",
    admin_cabdis:   "Admin Cabang Dinas",
    admin_kab_kota: "Admin Kab/Kota",
  };
  const role = user?.roles?.[0] ?? "";

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center gap-3">
        {/* Badge admin mode */}
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[11px] font-black uppercase tracking-widest">Mode Admin</span>
        </div>

        <div className="w-px h-4 bg-slate-700" />

        {/* Info user */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <UserCircle className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">{user?.name}</span>
          {role && (
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
              {roleLabel[role] ?? role}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors text-[11px] font-bold"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </div>
    </div>
  );
};
