import React, { useState, useEffect } from 'react';
import { LeaveRequest, LeaveType, LeaveStatus } from '../types';
import { Plus, X } from 'lucide-react';
import { apiGetMyLeaveRequests, apiCreateLeaveRequest } from '../services/api';

const StatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
    const statusMap = {
        [LeaveStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [LeaveStatus.Approved]: 'bg-green-100 text-green-800',
        [LeaveStatus.Rejected]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusMap[status]}`}>
            {status}
        </span>
    );
};

const LeaveRequestModal: React.FC<{ onClose: () => void; onSubmit: (newRequest: Omit<LeaveRequest, 'id' | 'userId' | 'status' | 'requestedAt'>) => void }> = ({ onClose, onSubmit }) => {
    const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.Personal);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ leaveType, startDate, endDate, reason });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">ขอลางาน</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                       <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทการลา</label>
                            <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className="w-full p-2 border border-gray-300 rounded-md">
                                {Object.values(LeaveType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่ม</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผล</label>
                            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} required className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">ยกเลิก</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">ส่งคำขอ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LeaveManagement: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userLeaveRequests, setUserLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const requests = await apiGetMyLeaveRequests();
                setUserLeaveRequests(requests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));
            } catch (error) {
                console.error("Failed to fetch leave requests", error);
                alert("ไม่สามารถโหลดประวัติการลาได้");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaveRequests();
    }, []);

    const handleRequestSubmit = async (newRequestData: Omit<LeaveRequest, 'id' | 'userId' | 'status' | 'requestedAt'>) => {
        try {
            const newRequest = await apiCreateLeaveRequest(newRequestData);
            setUserLeaveRequests([newRequest, ...userLeaveRequests]);
            setIsModalOpen(false);
            alert('ส่งคำขอลางานสำเร็จ');
        } catch (error) {
            console.error("Failed to create leave request", error);
            alert(error.message || 'ไม่สามารถส่งคำขอลางานได้');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">ประวัติการลาของฉัน</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                    <Plus size={20} className="mr-2" />
                    ขอลางาน
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ยื่นขอ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลา</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เหตุผล</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-4">กำลังโหลดข้อมูล...</td></tr>
                            ) : userLeaveRequests.length > 0 ? (
                                userLeaveRequests.map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.requestedAt).toLocaleDateString('th-TH')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.leaveType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.startDate).toLocaleDateString('th-TH')} - {new Date(req.endDate).toLocaleDateString('th-TH')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{req.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={req.status} /></td>
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </div>
                 {!loading && userLeaveRequests.length === 0 && <p className="p-4 text-center text-gray-500">ไม่มีประวัติการลา</p>}
            </div>

            {isModalOpen && <LeaveRequestModal onClose={() => setIsModalOpen(false)} onSubmit={handleRequestSubmit} />}
        </div>
    );
};

export default LeaveManagement;
