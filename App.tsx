import React, { useState, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { User, Role } from './types';
import { users } from './mockData';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TimeClock from './pages/TimeClock';
import LeaveManagement from './pages/LeaveManagement';
import Approvals from './pages/Approvals';
import Admin from './pages/Admin';
import LineRegister from './pages/LineRegister';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = useCallback((userId: string, password?: string) => {
        const user = users.find(u => {
            if (password) {
                return u.id === userId && u.password === password;
            }
            return u.id === userId;
        });

        if (user) {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            alert('รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง');
        }
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    }, []);

    const findUserByLineId = useCallback((lineUserId: string): User | null => {
        return users.find(u => u.lineUserId === lineUserId) || null;
    }, []);

    const registerAndLogin = useCallback((userData: Omit<User, 'avatar' | 'role' | 'password'>) => {
        const newUser: User = {
            ...userData,
            avatar: `https://picsum.photos/seed/${userData.id}/200`,
            role: Role.Employee,
            password: 'password123',
        };
        users.push(newUser); 
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
    }, []);

    const authContextValue = useMemo(() => ({
        currentUser,
        login,
        logout,
        findUserByLineId,
        registerAndLogin
    }), [currentUser, login, logout, findUserByLineId, registerAndLogin]);

    return (
        <AuthContext.Provider value={authContextValue}>
            <HashRouter>
                <Routes>
                    {!currentUser ? (
                        <>
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/line-register" element={<LineRegister />} />
                          <Route path="*" element={<Navigate to="/login" replace />} />
                        </>
                    ) : (
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/time-clock" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="time-clock" element={<TimeClock />} />
                            <Route path="leave" element={<LeaveManagement />} />
                            { (currentUser.role === Role.Manager || currentUser.role === Role.Supervisor) && (
                                <Route path="approvals" element={<Approvals />} />
                            )}
                            { currentUser.role === Role.Admin && (
                                <Route path="admin" element={<Admin />} />
                            )}
                            <Route path="*" element={<Navigate to="/time-clock" replace />} />
                        </Route>
                    )}
                    <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
                </Routes>
            </HashRouter>
        </AuthContext.Provider>
    );
};

export default App;