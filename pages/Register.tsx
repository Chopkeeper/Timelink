import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../mockData';
import { User } from '../types';

// SVG for LINE icon
const LineIcon = () => (
    <svg viewBox="0 0 256 256" className="w-6 h-6 mr-3">
        <path fill="#00C300" d="M228.33,128.03c0-55.43-45.03-100.46-100.46-100.46S27.41,72.6,27.41,128.03 c0,50.18,36.93,91.68,85.03,98.98v-67.45H89.26V128.03h23.18v-20.4c0-22.95,14.03-35.47,34.52-35.47 c9.82,0,18.25,0.73,20.71,1.06v27.26h-16.15c-11.14,0-13.3,5.29-13.3,13.06v17.16h30.17l-3.93,31.53h-26.24v67.45 C191.4,219.71,228.33,178.21,228.33,128.03z"/>
    </svg>
);


const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        nationalId: '',
        professionalId: '',
        department: '',
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLineLogin = () => {
        // In a real application, you would get these from your .env file
        const LINE_CLIENT_ID = 'YOUR_LINE_CLIENT_ID'; // Replace with your actual Channel ID from LINE Developers Console
        const REDIRECT_URI = 'http://localhost:3000/auth/line/callback'; // Your backend callback URL
        const STATE = 'some_random_state_string'; // A random string for security (CSRF protection)

        // The URL for initiating LINE Login
        const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=profile%20openid%20email`;
        
        // Redirect the user to LINE's authorization page
        // window.location.href = lineLoginUrl;

        // For this demo, we'll just show an alert
        alert('Redirecting to LINE Login...\n(This is a simulation. In a real app, you would be sent to LINE.)');
        console.log('Redirecting to:', lineLoginUrl);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if(Object.values(formData).some(val => val === '') || !password || !confirmPassword) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (password !== confirmPassword) {
            alert('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }

        // In a real app, this would be an API call to your backend to register the user.
        // The backend would then save the user to the MongoDB database.
        const newUser: User = {
            ...formData,
            password: password,
            avatar: `https://picsum.photos/seed/${formData.id}/200`,
            role: 'พนักงานปฏิบัติการ', // Default role for new sign-ups
        };

        // For this demo, we add it to our mock data and navigate to login.
        users.push(newUser);
        alert(`สมัครสมาชิกสำเร็จ! รหัสพนักงานของคุณคือ: ${formData.id}\nกรุณาใช้รหัสนี้และรหัสผ่านที่คุณตั้งไว้เพื่อเข้าสู่ระบบ`);
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">สมัครสมาชิก</h1>
                    <p className="mt-2 text-gray-500">สร้างบัญชี TimeLink HR ของคุณ</p>
                </div>
                
                <button
                    onClick={handleLineLogin}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors font-semibold"
                >
                    <LineIcon />
                    สมัครสมาชิกด้วย LINE
                </button>

                <div className="flex items-center justify-center">
                    <hr className="w-full border-gray-300" />
                    <span className="px-4 text-gray-500 bg-white">หรือ</span>
                    <hr className="w-full border-gray-300" />
                </div>

                <form className="space-y-4" onSubmit={handleFormSubmit}>
                     <input name="name" type="text" required placeholder="ชื่อ-สกุล" value={formData.name} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="id" type="text" required placeholder="รหัสพนักงานที่ต้องการ" value={formData.id} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="nationalId" type="text" required placeholder="เลขบัตรประชาชน" value={formData.nationalId} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="professionalId" type="text" required placeholder="เลขรหัสวิชาชีพ" value={formData.professionalId} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="department" type="text" required placeholder="หน่วยงาน" value={formData.department} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="password" type="password" required placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="confirmPassword" type="password" required placeholder="ยืนยันรหัสผ่าน" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            สมัครสมาชิก
                        </button>
                    </div>
                </form>

                 <div className="text-center text-sm text-gray-500">
                    <p>
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            เข้าสู่ระบบที่นี่
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;