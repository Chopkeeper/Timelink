
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { timeLogs } from '../mockData';
import { TimeLog } from '../types';
import { QrCode, X } from 'lucide-react';

const ClockButton: React.FC<{ onClick: () => void; label: string; time: string | null; bgColor: string }> = ({ onClick, label, time, bgColor }) => (
    <button onClick={onClick} className={`w-full md:w-2/5 h-48 rounded-2xl text-white flex flex-col items-center justify-center transition-transform transform hover:scale-105 shadow-xl ${bgColor}`}>
        <span className="text-4xl font-bold">{label}</span>
        <span className="text-lg mt-2">{time ? new Date(time).toLocaleTimeString('th-TH') : 'ยังไม่บันทึก'}</span>
    </button>
);

const QRCodeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                <X size={24} />
            </button>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Scan QR Code with LINE</h3>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://line.me/ti/p/@your-line-oa`} alt="LINE QR Code" />
            <p className="mt-4 text-gray-600">เปิดแอป LINE และสแกน QR Code นี้เพื่อบันทึกเวลา</p>
        </div>
    </div>
);


const TimeClock: React.FC = () => {
    const { currentUser } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayLog, setTodayLog] = useState<TimeLog | null>(null);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const log = timeLogs.find(l => l.userId === currentUser?.id && l.date === todayStr) || null;
        setTodayLog(log);
    }, [currentUser]);

    const handleCheckIn = () => {
        if (todayLog?.checkIn) {
            alert('คุณได้ลงเวลาเข้างานแล้ววันนี้');
            return;
        }
        const now = new Date().toISOString();
        const todayStr = now.split('T')[0];
        const newLog = { 
            id: `TL${Date.now()}`, 
            userId: currentUser!.id, 
            date: todayStr, 
            checkIn: now, 
            checkOut: null 
        };
        // In a real app, this would be an API call
        timeLogs.push(newLog); 
        setTodayLog(newLog);
        alert(`ลงเวลาเข้างานสำเร็จ: ${new Date(now).toLocaleTimeString('th-TH')}`);
    };

    const handleCheckOut = () => {
        if (!todayLog?.checkIn) {
            alert('กรุณาลงเวลาเข้างานก่อน');
            return;
        }
        if (todayLog?.checkOut) {
            alert('คุณได้ลงเวลาออกงานแล้ววันนี้');
            return;
        }
        const now = new Date().toISOString();
        const updatedLog = { ...todayLog, checkOut: now };
        // In a real app, this would be an API call
        const logIndex = timeLogs.findIndex(l => l.id === todayLog.id);
        if (logIndex > -1) timeLogs[logIndex] = updatedLog as TimeLog;
        setTodayLog(updatedLog as TimeLog);
        alert(`ลงเวลาออกงานสำเร็จ: ${new Date(now).toLocaleTimeString('th-TH')}`);
    };

    return (
        <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800">{currentTime.toLocaleTimeString('th-TH')}</h1>
            <p className="text-xl text-gray-500 mt-2">{currentTime.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8">
                <ClockButton onClick={handleCheckIn} label="เข้างาน" time={todayLog?.checkIn || null} bgColor="bg-gradient-to-br from-green-500 to-emerald-600" />
                <ClockButton onClick={handleCheckOut} label="ออกงาน" time={todayLog?.checkOut || null} bgColor="bg-gradient-to-br from-red-500 to-orange-600" />
            </div>

            <div className="mt-12">
                <button onClick={() => setShowQR(true)} className="flex items-center mx-auto bg-white py-3 px-6 rounded-full shadow-lg text-lg text-green-600 font-semibold hover:bg-gray-100 transition">
                    <QrCode className="mr-3" />
                    Scan QR Code ผ่าน LINE
                </button>
            </div>
            
            {showQR && <QRCodeModal onClose={() => setShowQR(false)} />}
        </div>
    );
};

export default TimeClock;
