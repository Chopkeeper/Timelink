import React, { useState, useEffect } from 'react';
import { TimeLog, SystemSettings } from '../types';
import { QrCode, X, MapPin } from 'lucide-react';
import { apiGetTodayLog, apiCheckIn, apiCheckOut, apiGetSystemSettings } from '../services/api';

// --- Helper Functions ---
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    });
};

// --- Components ---
const ClockButton: React.FC<{ onClick: () => void; label: string; time: string | null; bgColor: string; disabled: boolean }> = ({ onClick, label, time, bgColor, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full md:w-2/5 h-48 rounded-2xl text-white flex flex-col items-center justify-center transition-transform transform hover:scale-105 shadow-xl ${bgColor} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
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
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayLog, setTodayLog] = useState<TimeLog | null>(null);
    const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
    const [showQR, setShowQR] = useState(false);
    const [locationMessage, setLocationMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [log, settings] = await Promise.all([apiGetTodayLog(), apiGetSystemSettings()]);
                setTodayLog(log);
                setSystemSettings(settings);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                setLocationMessage({ text: 'ไม่สามารถโหลดข้อมูลระบบได้', type: 'error' });
            }
        };
        fetchData();
    }, []);

    const handleTimeLog = async (logType: 'checkIn' | 'checkOut') => {
        if (!systemSettings) {
            alert('ยังไม่สามารถบันทึกเวลาได้เนื่องจากข้อมูลระบบยังไม่ถูกตั้งค่า');
            return;
        }

        setIsLoading(true);
        setLocationMessage({ text: 'กำลังระบุตำแหน่งของคุณ...', type: 'info' });

        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            const distance = getDistanceInMeters(
                latitude,
                longitude,
                systemSettings.officeLocation.latitude,
                systemSettings.officeLocation.longitude
            );

            if (distance > systemSettings.checkInRadiusMeters) {
                const errorMessage = `คุณอยู่นอกพื้นที่ (${Math.round(distance)} ม.) ต้องอยู่ในระยะ ${systemSettings.checkInRadiusMeters} ม.`;
                setLocationMessage({ text: errorMessage, type: 'error' });
                alert(errorMessage);
                setIsLoading(false);
                return;
            }

            const timeLabel = logType === 'checkIn' ? 'เข้างาน' : 'ออกงาน';
            const successMessage = `ลงเวลา${timeLabel}สำเร็จ! ระยะห่าง: ${Math.round(distance)} ม.`;
            
            let updatedLog;
            if (logType === 'checkIn') {
                updatedLog = await apiCheckIn({ latitude, longitude });
            } else {
                updatedLog = await apiCheckOut({ latitude, longitude });
            }
            setTodayLog(updatedLog);
            setLocationMessage({ text: `บันทึกตำแหน่ง${timeLabel}แล้ว`, type: 'success' });
            alert(successMessage);

        } catch (error: any) {
            const specificMessage = error?.message || 'ไม่สามารถเข้าถึงตำแหน่งได้';
            const errorMessage = `ไม่สามารถบันทึกเวลาได้: ${specificMessage}.`;
            setLocationMessage({ text: specificMessage, type: 'error' });
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const messageColors = {
        success: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };

    const isCheckInDisabled = isLoading || !!todayLog?.checkIn;
    const isCheckOutDisabled = isLoading || !todayLog?.checkIn || !!todayLog?.checkOut;

    return (
        <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800">{currentTime.toLocaleTimeString('th-TH')}</h1>
            <p className="text-xl text-gray-500 mt-2">{currentTime.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            {locationMessage && (
                <div className={`mt-4 inline-flex items-center ${messageColors[locationMessage.type]} text-sm font-medium px-4 py-2 rounded-full transition-all`}>
                    <MapPin size={16} className="mr-2" />
                    {locationMessage.text}
                </div>
            )}

            <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-8">
                <ClockButton onClick={() => handleTimeLog('checkIn')} label="เข้างาน" time={todayLog?.checkIn || null} bgColor="bg-gradient-to-br from-green-500 to-emerald-600" disabled={isCheckInDisabled} />
                <ClockButton onClick={() => handleTimeLog('checkOut')} label="ออกงาน" time={todayLog?.checkOut || null} bgColor="bg-gradient-to-br from-red-500 to-orange-600" disabled={isCheckOutDisabled} />
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
