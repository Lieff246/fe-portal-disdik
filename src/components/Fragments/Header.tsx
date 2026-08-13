import React from "react";
import type { CabangConfig } from "@/types";
import { Icon } from "@iconify/react";

export const Header: React.FC<{
  cabangConfig?: CabangConfig;
  onOpenTracking?: () => void;
}> = ({ cabangConfig, onOpenTracking }) => {
  return (
    <header className="bg-white absolute top-0 left-0 right-0 z-50 py-4 border-b border-gray-100">
      <div className="container mx-auto px-10 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <img src="/logo.svg" />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="#"
            className="font-bold text-indigo-500 transition-colors bg-blue-50 px-6 py-2 rounded-full"
          >
            Dashboard
          </a>
          <a
            href="#admin"
            className=" text-gray-500 hover:text-primary transition-colors"
          >
            Daftar Admin
          </a>
          <a
            href="#tentang"
            className=" text-gray-500 hover:text-primary transition-colors"
          >
            Tentang Kami
          </a>
        </nav>

        {/* Action Button */}
        <button
          onClick={onOpenTracking}
          className="bg-indigo-500 hover:bg-indigo-500/90 text-white rounded-full px-6 py-2.5 flex items-center gap-2 transition-all shadow-lg shadow-primary/20 group cursor-pointer"
        >
          <Icon icon="tabler:search" className="text-lg"/>
          <span className="font-medium text-sm">Cek Ketersedian Guru</span>
        </button>
      </div>
    </header>
  );
};
