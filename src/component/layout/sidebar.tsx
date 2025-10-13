// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   BookOpen,
//   ArrowDownCircle,
//   ArrowUpCircle,
//   FileSpreadsheet,
// } from "lucide-react";
// import "./global.css";

// interface SidebarProps {
//   isOpen: boolean;
//   onClose?: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
//   const menuItems = [
//     { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
//     { name: "Buku Utama", path: "/buku-utama", icon: <BookOpen size={18} /> },
//     { name: "Uang Masuk", path: "/uang-masuk", icon: <ArrowDownCircle size={18} /> },
//     { name: "Uang Keluar", path: "/uang-keluar", icon: <ArrowUpCircle size={18} /> },
//     { name: "Laporan Lapangan", path: "/laporan-lapangan", icon: <FileSpreadsheet size={18} /> },
//   ];

//   return (
//     <aside
//       className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}
//     >
//       {/* Logo/Header */}
//       <div className="sidebar-header">
//         <div className="sidebar-logo">💼</div>
//         {isOpen && <h1 className="sidebar-title">Keuangan App</h1>}
//       </div>

//       {/* Menu Navigasi */}
//       <nav className="sidebar-nav">
//         {menuItems.map((item, index) => (
//           <NavLink
//             key={index}
//             to={item.path}
//             end={item.path === "/"}
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <div className="sidebar-icon">{item.icon}</div>
//             {isOpen && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="sidebar-footer">
//         {isOpen ? (
//           <div>© {new Date().getFullYear()} Keuangan App</div>
//         ) : (
//           <div className="text-center">©</div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

// src/component/layout/Sidebar.tsx
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
} from "lucide-react";
import "../../component/layout/global.css";
import { title } from "process";

interface SidebarProps {
  isOpen: boolean;
  onCLose?: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    { title: "Buku Utama", icon: <BookOpen size={18} />, path: "/buku-utama" },
    { title: "Laporan Lapangan", icon: <FileSpreadsheet size={18} />, path: "/laporan-lapangan" },
    { title: "Uang Masuk", path: "/uang-masuk", icon: <ArrowDownCircle size={18} /> },
    { title: "Uang Keluar", path: "/uang-keluar", icon: <ArrowUpCircle size={18} /> },
//     { name: "Laporan Lapangan", path: "/laporan-lapangan", icon: <FileSpreadsheet size={18} /> },
  ];

  return (
    <aside
      className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}
    >
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <span className="logo-icon">💰</span>
          {isOpen && <span>Keuangan App</span>}
        </h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.icon}
            {isOpen && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item logout-btn">
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}


