
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { BarChart2, Clock, Calendar, CheckSquare, Shield, X } from 'lucide-react';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`
        }
    >
        {icon}
        <span className="mx-4 font-medium">{children}</span>
    </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === Role.Admin;
    const isManager = currentUser?.role === Role.Manager || currentUser?.role === Role.Supervisor;

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>

            <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-600">TimeLink</h2>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="mt-10">
                    <NavItem to="/time-clock" icon={<Clock size={20} />}>บันทึกเวลา</NavItem>
                    <NavItem to="/dashboard" icon={<BarChart2 size={20} />}>แดชบอร์ด</NavItem>
                    <NavItem to="/leave" icon={<Calendar size={20} />}>จัดการการลา</NavItem>
                    {isManager && (
                        <NavItem to="/approvals" icon={<CheckSquare size={20} />}>อนุมัติการลา</NavItem>
                    )}
                    {isAdmin && (
                        <NavItem to="/admin" icon={<Shield size={20} />}>แอดมิน</NavItem>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
