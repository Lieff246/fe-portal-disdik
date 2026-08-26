import { Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  nama: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal konfirmasi hapus — reusable di semua halaman publik.
 */
export const DeleteConfirmModal = ({
  isOpen,
  nama,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        {/* Tombol tutup */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>

        {/* Teks */}
        <div>
          <h3 className="text-base font-black text-slate-800">Hapus Sekolah?</h3>
          <p className="text-sm text-slate-500 mt-1">
            Kamu akan menghapus{" "}
            <span className="font-bold text-slate-700">"{nama}"</span>.
            Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>

        {/* Tombol aksi */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};
