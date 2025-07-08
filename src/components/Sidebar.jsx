import React from "react";
import { FaChartPie, FaWallet, FaFileAlt, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const menu = [
    { icon: <FaFileAlt />, label: "Portfolio" },   
  ];
  return (
    <div className="bg-white/90 h-full w-56 p-6 flex flex-col justify-between border-r border-indigo-100 shadow-md">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <span className="font-bold text-indigo-700 text-lg">Crypto Log</span>
        </div>
        <ul>
          {menu.map((item, idx) => (
            <li
              key={item.label}
              className={`flex items-center gap-3 mb-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                idx === 2 ? "bg-indigo-100 font-semibold text-indigo-700" : "hover:bg-indigo-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span> {item.label}
            </li>
          ))}
        </ul>
      </div>
      <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-sm hover:bg-indigo-100">
        <FaSignOutAlt /> Cerrar
      </button>
    </div>
  );
}