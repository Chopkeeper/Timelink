import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { User } from './types';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TimeClock from './pages/TimeClock';
import LeaveManagement from './pages/LeaveManagement';
import Approvals from './pages/Approvals';
import Admin from './pages/Admin';
import LineRegister from './pages/LineRegister';
import { apiLogin, apiLineRegister, apiGetUserByLineId } from './services/api';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');
        if (user && token) {
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (userId: string, password?: string) => {
        try {
            const { token, user } = await apiLogin(userId, password);
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', token);
        } catch (error) {
            console.error(error);
            alert(error.message || 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง');
        }
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    }, []);

    const findUserByLineId = useCallback(async (lineUserId: string): Promise<{exists: boolean, user?: User, token?: string}> => {
        try {
            const response = await apiGetUserByLineId(lineUserId);
            if (response.exists) {
                setCurrentUser(response.user);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                return { exists: true, user: response.user };
            }
            return { exists: false };
        } catch (error) {
            console.error("Error finding user by Line ID:", error);
            return { exists: false };
        }
    }, []);

    const registerAndLogin = useCallback(async (userData: Omit<User, 'avatar' | 'role' | 'password'>) => {
       try {
            const { token, user } = await apiLineRegister(userData);
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', token);
       } catch (error) {
           console.error(error);
           alert(error.message || 'ไม่สามารถลงทะเบียนได้');
       }
    }, []);

    const authContextValue = useMemo(() => ({
        currentUser,
        login,
        logout,
        findUserByLineId,
        registerAndLogin
    }), [currentUser, login, logout, findUserByLineId, registerAndLogin]);

    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

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
                            <Route index element={<Navigate to={currentUser.role === 'พนักงานปฏิบัติการ' ? "/time-clock" : "/dashboard"} replace />} />
                            {currentUser.role !== 'พนักงานปฏิบัติการ' && (
                                <Route path="dashboard" element={<Dashboard />} />
                            )}
                            <Route path="time-clock" element={<TimeClock />} />
                            <Route path="leave" element={<LeaveManagement />} />
                            { (currentUser.role === 'ผู้จัดการ' || currentUser.role === 'หัวหน้างาน') && (
                                <Route path="approvals" element={<Approvals />} />
                            )}
                            { currentUser.role === 'ผู้ดูแลระบบ' && (
                                <Route path="admin" element={<Admin />} />
                            )}
                            <Route path="*" element={<Navigate to={currentUser.role === 'พนักงานปฏิบัติการ' ? "/time-clock" : "/dashboard"} replace />} />
                        </Route>
                    )}
                    <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
                </Routes>
            </HashRouter>
        </AuthContext.Provider>
    );
};

export default App;
