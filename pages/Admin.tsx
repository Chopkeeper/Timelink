import React, { useState, useEffect, useMemo } from 'react';
import { User, TimeLog, RoleType, SystemSettings } from '../types';
import { X, Save, PlusCircle, Trash2, Edit, MapPin, Settings, LocateFixed } from 'lucide-react';
import { 
    apiGetAllUsers, apiAddUser, apiDeleteUser,
    apiGetAllTimeLogs, apiUpdateTimeLog,
    apiGetAllRoles, apiAddRole, apiUpdateRole, apiDeleteRole,
    apiGetSystemSettings, apiUpdateSystemSettings
} from '../services/api';

// Modal for adding a new user
const AddUserModal: React.FC<{ roles: RoleType[]; onClose: () => void; onSave: (newUser: User) => void; }> = ({ roles, onClose, onSave }) => {
    const [newUser, setNewUser] = useState<Omit<User, 'avatar'>>({
        id: '',
        name: '',
        nationalId: '',
        professionalId: '',
        department: '',
        role: roles[0]?.name || '',
        password: 'password123'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(newUser).some(val => val === '')) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }
        const userToSave: User = {
            ...newUser,
            avatar: `https://picsum.photos/seed/${newUser.id}/200`,
        };
        onSave(userToSave);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">เพิ่มผู้ใช้งานใหม่</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="id" placeholder="รหัสพนักงาน" value={newUser.id} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="name" placeholder="ชื่อ-สกุล" value={newUser.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="nationalId" placeholder="เลขบัตรประชาชน" value={newUser.nationalId} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="professionalId" placeholder="เลขรหัสวิชาชีพ" value={newUser.professionalId} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="department" placeholder="หน่วยงาน" value={newUser.department} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <select name="role" value={newUser.role} onChange={handleChange} className="w-full p-2 border rounded">
                        {roles.map(role => <option key={role.name} value={role.name}>{role.name}</option>)}
                    </select>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal for editing time logs
const EditTimeLogModal: React.FC<{ log: TimeLog; user: User; onClose: () => void; onSave: (updatedLog: TimeLog) => void; }> = ({ log, user, onClose, onSave }) => {
    const [checkIn, setCheckIn] = useState(log.checkIn ? new Date(log.checkIn).toISOString().substring(0, 16) : '');
    const [checkOut, setCheckOut] = useState(log.checkOut ? new Date(log.checkOut).toISOString().substring(0, 16) : '');

    const handleSubmit = () => {
        onSave({
            ...log,
            checkIn: checkIn ? new Date(checkIn).toISOString() : null,
            checkOut: checkOut ? new Date(checkOut).toISOString() : null,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">แก้ไขเวลาของ {user.name}</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">เวลาเข้างาน (Check-in)</label>
                        <input type="datetime-local" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">เวลาออกงาน (Check-out)</label>
                        <input type="datetime-local" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">บันทึก</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal for adding/editing roles
const RoleModal: React.FC<{ role?: RoleType | null; onClose: () => void; onSave: (role: RoleType, originalName?: string) => void; }> = ({ role, onClose, onSave }) => {
    const [name, setName] = useState(role?.name || '');
    const [level, setLevel] = useState(role?.level || 1);

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedLevel = parseInt(e.target.value, 10);
        setLevel(isNaN(parsedLevel) ? 0 : parsedLevel);
    };

    const handleSubmit = () => {
        if (!name || level < 1) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วนและลำดับขั้นต้องมากกว่า 0');
            return;
        }
        onSave({ name, level }, role?.name);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{role ? 'แก้ไขตำแหน่ง' : 'เพิ่มตำแหน่งใหม่'}</h2>
                <div className="space-y-4">
                    <input placeholder="ชื่อตำแหน่ง" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="ลำดับขั้น (e.g., 1 for lowest)" value={level} onChange={handleLevelChange} className="w-full p-2 border rounded" />
                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">บันทึก</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Admin: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleType | null | undefined>(undefined);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [usersData, timeLogsData, rolesData, settingsData] = await Promise.all([
                    apiGetAllUsers(),
                    apiGetAllTimeLogs(),
                    apiGetAllRoles(),
                    apiGetSystemSettings()
                ]);
                setUsers(usersData);
                setTimeLogs(timeLogsData);
                setRoles(rolesData.sort((a,b) => a.level - b.level));
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to load admin data", error);
                alert("ไม่สามารถโหลดข้อมูลผู้ดูแลระบบได้");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const getUserById = (userId: string) => users.find(u => u.id === userId);

    const handleAddUser = async (newUser: User) => {
        try {
            const addedUser = await apiAddUser(newUser);
            setUsers([...users, addedUser]);
            setAddUserModalOpen(false);
        } catch (error) {
            alert(error.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?')) {
            try {
                await apiDeleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                alert(error.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
            }
        }
    };

    const handleSaveTimeLog = async (updatedLog: TimeLog) => {
        try {
            const savedLog = await apiUpdateTimeLog(updatedLog.id, updatedLog);
            setTimeLogs(timeLogs.map(log => log.id === savedLog.id ? savedLog : log));
            setEditingLog(null);
        } catch (error) {
             alert(error.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลเวลา');
        }
    };
    
    const handleSaveRole = async (roleToSave: RoleType, originalName?: string) => {
        try {
            let savedRole;
            if (originalName) {
                savedRole = await apiUpdateRole(originalName, roleToSave);
            } else {
                savedRole = await apiAddRole(roleToSave);
            }
            
            const existingRoles = roles.filter(r => r.name !== originalName && r.name !== savedRole.name);
            const updatedRoles = [...existingRoles, savedRole].sort((a, b) => a.level - b.level);
            
            setRoles(updatedRoles);
            setEditingRole(undefined);
        } catch (error) {
             alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกตำแหน่ง');
        }
    };

    const handleDeleteRole = async (roleName: string) => {
        if (users.some(u => u.role === roleName)) {
            alert('ไม่สามารถลบตำแหน่งได้ เนื่องจากยังมีพนักงานใช้งานอยู่');
            return;
        }
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่ง "${roleName}"?`)) {
            try {
                await apiDeleteRole(roleName);
                setRoles(roles.filter(r => r.name !== roleName));
            } catch (error) {
                alert(error.message || 'เกิดข้อผิดพลาดในการลบตำแหน่ง');
            }
        }
    };

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        const [field, subfield] = name.split('.');
        
        if (subfield) {
            setSettings(prev => ({
                ...prev!,
                [field]: { ...prev![field as keyof SystemSettings] as object, [subfield]: isNaN(numValue) ? 0 : numValue }
            }));
        } else {
            setSettings(prev => ({ ...prev!, [name]: isNaN(numValue) ? 0 : numValue }));
        }
    };

    const handleUseCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setSettings(prev => ({ ...prev!, officeLocation: { latitude, longitude } }));
                alert('ตั้งค่าตำแหน่งปัจจุบันสำเร็จ!');
            },
            (error) => { alert(`ไม่สามารถดึงตำแหน่งได้: ${error.message}`); }
        );
    };

    const handleSaveSettings = async () => {
        if (!settings) return;
        try {
            await apiUpdateSystemSettings(settings);
            alert('บันทึกการตั้งค่าสำเร็จแล้ว');
        } catch (error) {
            alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
        }
    };

    const sortedTimeLogs = useMemo(() =>
        [...timeLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.userId.localeCompare(b.userId)),
        [timeLogs]
    );

    if (loading) return <div>Loading Admin Panel...</div>;
    if (!settings) return <div>Could not load system settings. Please refresh.</div>

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                    <Settings size={24} className="text-gray-700 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">ตั้งค่าตำแหน่งที่ตั้งหลัก (Geofencing)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">ละติจูด</label>
                        <input type="number" step="any" name="officeLocation.latitude" value={settings.officeLocation.latitude} onChange={handleSettingsChange} className="mt-1 w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ลองจิจูด</label>
                        <input type="number" step="any" name="officeLocation.longitude" value={settings.officeLocation.longitude} onChange={handleSettingsChange} className="mt-1 w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">รัศมี (เมตร)</label>
                        <input type="number" name="checkInRadiusMeters" value={settings.checkInRadiusMeters} onChange={handleSettingsChange} className="mt-1 w-full p-2 border rounded" />
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                     <button onClick={handleUseCurrentLocation} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <LocateFixed size={20} /> ใช้ตำแหน่งปัจจุบันของฉัน
                    </button>
                    <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Save size={20} /> บันทึกการตั้งค่า
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">จัดการผู้ใช้งาน</h2>
                    <button onClick={() => setAddUserModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} /> เพิ่มผู้ใช้งาน
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หน่วยงาน</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">จัดการตำแหน่ง</h2>
                    <button onClick={() => setEditingRole(undefined)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} /> เพิ่มตำแหน่ง
                    </button>
                </div>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                             <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อตำแหน่ง</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับขั้น</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles.map(role => (
                                <tr key={role.name}>
                                    <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{role.level}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                                        <button onClick={() => setEditingRole(role)} className="text-blue-500 hover:text-blue-700"><Edit size={20} /></button>
                                        <button onClick={() => handleDeleteRole(role.name)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">จัดการข้อมูลเวลา</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พนักงาน</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เข้างาน</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ออกงาน</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่งเข้างาน</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedTimeLogs.map(log => {
                                const user = getUserById(log.userId);
                                return (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user?.name || log.userId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString('th-TH') : '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString('th-TH') : '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             {log.checkInLocation ? (
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${log.checkInLocation.latitude},${log.checkInLocation.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    <MapPin size={16} className="mr-1" />
                                                    ดูแผนที่
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">ไม่มีข้อมูล</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button onClick={() => setEditingLog(log)} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isAddUserModalOpen && <AddUserModal roles={roles} onClose={() => setAddUserModalOpen(false)} onSave={handleAddUser} />}
            {editingLog && <EditTimeLogModal log={editingLog} user={getUserById(editingLog.userId)!} onClose={() => setEditingLog(null)} onSave={handleSaveTimeLog} />}
            {editingRole !== null && editingRole !== undefined && <RoleModal role={editingRole} onClose={() => setEditingRole(undefined)} onSave={handleSaveRole} />}
            {editingRole === undefined && <RoleModal onClose={() => setEditingRole(null)} onSave={handleSaveRole} />}

        </div>
    );
};

export default Admin;
