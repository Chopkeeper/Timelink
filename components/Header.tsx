
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu } from 'lucide-react';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-200">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
                   <Menu className="h-6 w-6" />
                </button>
                <div className="relative mx-4 lg:mx-0">
                    <h1 className="text-lg font-semibold text-gray-700">TimeLink HR</h1>
                </div>
            </div>

            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <img className="h-10 w-10 rounded-full object-cover" src={currentUser?.avatar} alt="User avatar" />
                    <div className="ml-3 text-right">
                       <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
                       <p className="text-xs text-gray-500">{currentUser?.role}</p>
                    </div>
                </div>
                <button onClick={logout} className="p-2 rounded-full text-gray-500 bg-gray-100 hover:bg-red-100 hover:text-red-500 focus:outline-none focus:ring">
                   <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
