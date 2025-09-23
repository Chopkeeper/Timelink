import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { leaveRequests, timeLogs, users } from '../mockData';
import { LeaveType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Clock, Calendar, UserCheck, AlertTriangle } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const { currentUser } = useAuth();

    const lateArrivals = timeLogs
        .filter(log => log.checkIn && new Date(log.checkIn).getHours() >= 9 && new Date(log.checkIn).getMinutes() > 0)
        .map(log => {
            const user = users.find(u => u.id === log.userId);
            return {
                name: user?.name || 'Unknown',
                time: new Date(log.checkIn!).toLocaleTimeString('th-TH'),
                avatar: user?.avatar,
            };
        });
    
    const leaveData = Object.values(LeaveType).map(type => ({
        name: type,
        count: leaveRequests.filter(req => req.leaveType === type).length,
    }));
    
    const userTeamIds = currentUser?.role === 'ผู้ดูแลระบบ'
        ? users.map(u => u.id)
        : users.filter(u => u.supervisorId === currentUser?.id || u.managerId === currentUser?.id).map(u => u.id);

    const pendingApprovals = leaveRequests.filter(req => userTeamIds.includes(req.userId) && req.status === 'Pending').length;
    const approvedToday = leaveRequests.filter(req => new Date(req.startDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] && req.status === 'Approved').length;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">แดชบอร์ด</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <StatCard title="มาสายวันนี้" value={lateArrivals.length} icon={<Clock size={24} className="text-white"/>} color="bg-red-500" />
                 <StatCard title="ลาวันนี้" value={approvedToday} icon={<Calendar size={24} className="text-white"/>} color="bg-yellow-500" />
                 <StatCard title="พนักงานในทีม" value={userTeamIds.length} icon={<UserCheck size={24} className="text-white"/>} color="bg-green-500" />
                 <StatCard title="รออนุมัติ" value={pendingApprovals} icon={<AlertTriangle size={24} className="text-white"/>} color="bg-blue-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">สรุปข้อมูลการลา</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leaveData}>
                            <XAxis dataKey="name" tick={{ fontFamily: 'Kanit' }} />
                            <YAxis />
                            <Tooltip contentStyle={{ fontFamily: 'Kanit' }} />
                            <Legend wrapperStyle={{ fontFamily: 'Kanit' }} />
                            <Bar dataKey="count" name="จำนวนวันลา">
                                {leaveData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">พนักงานที่มาสาย (หลัง 09:00 น.)</h2>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {lateArrivals.length > 0 ? lateArrivals.map(employee => (
                            <div key={employee.name} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                                <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-800">{employee.name}</p>
                                    <p className="text-sm text-red-500 font-bold">{employee.time}</p>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 mt-4 text-center">ไม่มีพนักงานมาสายวันนี้</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;