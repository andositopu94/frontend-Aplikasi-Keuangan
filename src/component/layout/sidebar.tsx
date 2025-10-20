import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  LogOut,
  ArrowUpCircle,
  ArrowDownCircle,
  FileSpreadsheet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  NotebookPen
} from "lucide-react";
import "../../component/layout/global.css";
import { title } from "process";

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { title: "Buku Utama", icon: <BookOpen size={20} />, path: "/buku-utama" },
    { title: "Uang Masuk", path: "/uang-masuk", icon: <ArrowDownCircle size={20} /> },
    { title: "Uang Keluar", path: "/uang-keluar", icon: <ArrowUpCircle size={20} /> },
    { title: "Laporan Lapangan", icon: <FileSpreadsheet size={20} />, path: "/laporan-lapangan" },
    { title: "Kode Akun", icon: <NotebookPen size={20} />, path: "/akun" },
    { title: "Kode Kegiatan", icon: <NotebookPen size={20} />, path: "/kegiatan" }
  ];

  return (
    <aside
      className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}
    >
      <div className="sidebar-header">
        <div className="flex-between">
        <h2 className="sidebar-title">
          <span className="logo-icon">💰</span>
          {isOpen && <span className="fade-in">Keuangan App</span>}
        </h2>
        <button
          onClick={onToggle}
          className="menu-toggle"
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '6px',
            fontSize: '16px' 
           }}>
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
           </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            title={item.title}
          >
            {item.icon}
            {isOpen && <span className="slide-in">{item.title}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}


