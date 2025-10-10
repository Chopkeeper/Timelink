import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const LineIcon = () => (
    <svg viewBox="0 0 256 256" className="w-6 h-6 mr-3">
        <path fill="#00C300" d="M228.33,128.03c0-55.43-45.03-100.46-100.46-100.46S27.41,72.6,27.41,128.03 c0,50.18,36.93,91.68,85.03,98.98v-67.45H89.26V128.03h23.18v-20.4c0-22.95,14.03-35.47,34.52-35.47 c9.82,0,18.25,0.73,20.71,1.06v27.26h-16.15c-11.14,0-13.3,5.29-13.3,13.06v17.16h30.17l-3.93,31.53h-26.24v67.45 C191.4,219.71,228.33,178.21,228.33,128.03z"/>
    </svg>
);

const LoginQRCodeModal: React.FC<{ onClose: () => void; onSimulate: (lineUserId: string, displayName?: string) => void; }> = ({ onClose, onSimulate }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center relative max-w-sm w-full">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
                <X size={24} />
            </button>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">เข้าสู่ระบบด้วย LINE</h3>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://timelink-hr.example.com/login/auth`} alt="LINE Login QR Code" className="mx-auto" />
            <p className="mt-4 text-gray-600">ใช้แอปพลิเคชัน LINE สแกน QR Code เพื่อเข้าสู่ระบบ</p>
            <div className="mt-6 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-left text-sm">
                <p className="font-bold">สำหรับ Demo เท่านั้น:</p>
                <p>คลิกปุ่มด้านล่างเพื่อจำลองการสแกน QR Code</p>
            </div>
            <button 
                onClick={() => onSimulate('U12345_EMP001')}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
                จำลองสแกน (ผู้ใช้เดิม: สมชาย ใจดี)
            </button>
            <button 
                onClick={() => onSimulate('U67890_NEWUSER', 'ผู้ใช้ LINE ใหม่')}
                className="mt-2 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
                จำลองสแกน (ผู้ใช้ใหม่)
            </button>
        </div>
    </div>
);


const Login: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showQR, setShowQR] = useState(false);
    const { login, findUserByLineId } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId && password) {
            login(userId, password);
        } else {
            alert('กรุณากรอกรหัสพนักงานและรหัสผ่าน');
        }
    };

    const handleSimulatedQrLogin = async (lineUserId: string, displayName?: string) => {
        setShowQR(false);
        const { exists } = await findUserByLineId(lineUserId);
        if (!exists) {
            navigate('/line-register', { 
                state: { 
                    lineUserId, 
                    displayName: displayName || 'New LINE User' 
                } 
            });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">TimeLink HR</h1>
                    <p className="mt-2 text-gray-500">ลงชื่อเข้าใช้เพื่อเริ่มการทำงานของคุณ</p>
                </div>
                
                <button
                    onClick={() => setShowQR(true)}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-md text-white bg-green-500 hover:bg-green-600 transition-transform transform hover:scale-105 font-semibold shadow-md"
                >
                    <LineIcon />
                    เข้าสู่ระบบด้วย LINE
                </button>

                <div className="flex items-center justify-center">
                    <hr className="w-full border-gray-300" />
                    <span className="px-4 text-gray-500 bg-white">หรือ</span>
                    <hr className="w-full border-gray-300" />
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="userId" className="sr-only">รหัสพนักงาน</label>
                        <input
                            id="userId"
                            name="userId"
                            type="text"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="รหัสพนักงาน"
                        />
                    </div>
                     <div>
                        <label htmlFor="password"className="sr-only">รหัสผ่าน</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="รหัสผ่าน"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            ลงชื่อเข้าใช้
                        </button>
                    </div>
                </form>

                 <div className="text-center text-sm text-gray-500">
                    <p>
                        ยังไม่มีบัญชี?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            สมัครสมาชิกที่นี่
                        </Link>
                    </p>
                </div>
            </div>
            {showQR && <LoginQRCodeModal onClose={() => setShowQR(false)} onSimulate={handleSimulatedQrLogin} />}
        </div>
    );
};

export default Login;
