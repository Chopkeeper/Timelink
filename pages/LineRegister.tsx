import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

const LineRegister: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { registerAndLogin } = useAuth();

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        nationalId: '',
        professionalId: '',
        department: '',
    });

    useEffect(() => {
        if (!state?.lineUserId) {
            alert('ข้อมูลการลงทะเบียนไม่ถูกต้อง กรุณาลองเข้าสู่ระบบด้วย LINE อีกครั้ง');
            navigate('/login');
        } else {
            setFormData(prev => ({ ...prev, name: state.displayName || '' }));
        }
    }, [state, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(formData).some(val => val === '')) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const newUserPayload: Omit<User, 'avatar' | 'role' | 'password'> = {
            ...formData,
            lineUserId: state.lineUserId,
        };

        registerAndLogin(newUserPayload);
    };
    
    if (!state?.lineUserId) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">ลงทะเบียนเพิ่มเติม</h1>
                    <p className="mt-2 text-gray-500">กรอกข้อมูลเพื่อเชื่อมต่อกับบัญชี LINE ของคุณ</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อ-สกุล (จาก LINE)</label>
                        <input name="name" type="text" required value={formData.name} onChange={handleInputChange} className="mt-1 appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100" />
                    </div>
                     <input name="id" type="text" required placeholder="รหัสพนักงาน" value={formData.id} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="nationalId" type="text" required placeholder="เลขบัตรประชาชน" value={formData.nationalId} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="professionalId" type="text" required placeholder="เลขรหัสวิชาชีพ" value={formData.professionalId} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                     <input name="department" type="text" required placeholder="หน่วยงาน" value={formData.department} onChange={handleInputChange} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            ยืนยันและเข้าสู่ระบบ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LineRegister;