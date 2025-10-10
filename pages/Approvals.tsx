
import React, { useState, useEffect } from 'react';
import { LeaveRequest, LeaveStatus, User } from '../types';
import { apiGetPendingApprovals, apiUpdateLeaveStatus, apiGetAllUsers } from '../services/api';

const Approvals: React.FC = () => {
    const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requests, allUsers] = await Promise.all([
                    apiGetPendingApprovals(),
                    apiGetAllUsers()
                ]);
                setPendingRequests(requests);
                setUsers(allUsers);
            } catch (error) {
                console.error("Failed to fetch data for approvals:", error);
                alert("ไม่สามารถโหลดข้อมูลคำขออนุมัติได้");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // FIX: Narrowed the type of `newStatus` to only include statuses valid for this action, resolving a type error.
    const handleUpdateStatus = async (requestId: string, newStatus: LeaveStatus.Approved | LeaveStatus.Rejected) => {
        try {
            await apiUpdateLeaveStatus(requestId, newStatus);
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));
            const updatedRequest = pendingRequests.find(r => r.id === requestId);
            const user = getUserById(updatedRequest?.userId || '');
            alert(`คำขอของ ${user?.name} ได้รับการ ${newStatus === LeaveStatus.Approved ? 'อนุมัติ' : 'ปฏิเสธ'} แล้ว`);
        } catch (error) {
             console.error("Failed to update leave status:", error);
            alert(error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    };

    const getUserById = (userId: string): User | undefined => users.find(u => u.id === userId);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">คำขอที่รออนุมัติ</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พนักงาน</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เหตุผล</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                             {loading ? (
                                <tr><td colSpan={5} className="text-center p-4">กำลังโหลดข้อมูล...</td></tr>
                            ) : pendingRequests.length > 0 ? (
                                pendingRequests.map(req => {
                                    const user = getUserById(req.userId);
                                    return (
                                        <tr key={req.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img className="h-10 w-10 rounded-full" src={user?.avatar} alt={user?.name} />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                                                        <div className="text-sm text-gray-500">{user?.department}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.leaveType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.startDate).toLocaleDateString('th-TH')} - {new Date(req.endDate).toLocaleDateString('th-TH')}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{req.reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => handleUpdateStatus(req.id, LeaveStatus.Approved)} className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded-md">อนุมัติ</button>
                                                    <button onClick={() => handleUpdateStatus(req.id, LeaveStatus.Rejected)} className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded-md">ปฏิเสธ</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                             ) : null}
                        </tbody>
                    </table>
                </div>
                {!loading && pendingRequests.length === 0 && <p className="p-4 text-center text-gray-500">ไม่มีคำขอที่รอการอนุมัติ</p>}
            </div>
        </div>
    );
};

export default Approvals;
