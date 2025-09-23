import { User, LeaveRequest, LeaveType, LeaveStatus, TimeLog, RoleType, SystemSettings } from './types';

export const roles: RoleType[] = [
    { name: 'พนักงานปฏิบัติการ', level: 1 },
    { name: 'หัวหน้างาน', level: 2 },
    { name: 'ผู้จัดการ', level: 3 },
    { name: 'ผู้ดูแลระบบ', level: 4 },
];

export const users: User[] = [
    { id: 'EMP001', name: 'สมชาย ใจดี', nationalId: '1234567890123', professionalId: 'P-1111', department: 'IT', avatar: 'https://picsum.photos/seed/EMP001/200', role: 'พนักงานปฏิบัติการ', supervisorId: 'SUP001', managerId: 'MAN001', password: 'password123', lineUserId: 'U12345_EMP001' },
    { id: 'EMP002', name: 'สมหญิง จริงใจ', nationalId: '1234567890124', professionalId: 'P-2222', department: 'IT', avatar: 'https://picsum.photos/seed/EMP002/200', role: 'พนักงานปฏิบัติการ', supervisorId: 'SUP001', managerId: 'MAN001', password: 'password123' },
    { id: 'SUP001', name: 'สมศักดิ์ รักงาน', nationalId: '1234567890125', professionalId: 'P-3333', department: 'IT', avatar: 'https://picsum.photos/seed/SUP001/200', role: 'หัวหน้างาน', managerId: 'MAN001', password: 'password123' },
    { id: 'EMP003', name: 'มานี มีนา', nationalId: '1234567890126', professionalId: 'P-4444', department: 'HR', avatar: 'https://picsum.photos/seed/EMP003/200', role: 'พนักงานปฏิบัติการ', supervisorId: 'MAN001', managerId: 'ADMIN01', password: 'password123' },
    { id: 'MAN001', name: 'มานะ อดทน', nationalId: '1234567890127', professionalId: 'P-5555', department: 'Management', avatar: 'https://picsum.photos/seed/MAN001/200', role: 'ผู้จัดการ', managerId: 'ADMIN01', password: 'password123' },
    { id: 'ADMIN01', name: 'แอดมิน สูงสุด', nationalId: '1234567890128', professionalId: 'P-6666', department: 'Administration', avatar: 'https://picsum.photos/seed/ADMIN01/200', role: 'ผู้ดูแลระบบ', password: 'password123' },
];

export const leaveRequests: LeaveRequest[] = [
    { id: 'LR001', userId: 'EMP001', leaveType: LeaveType.Vacation, startDate: '2024-08-10', endDate: '2024-08-12', reason: 'พักผ่อนประจำปี', status: LeaveStatus.Approved, requestedAt: '2024-07-20T10:00:00Z' },
    { id: 'LR002', userId: 'EMP002', leaveType: LeaveType.Sick, startDate: '2024-08-01', endDate: '2024-08-01', reason: 'อาหารเป็นพิษ', status: LeaveStatus.Approved, requestedAt: '2024-08-01T08:30:00Z' },
    { id: 'LR003', userId: 'EMP001', leaveType: LeaveType.Personal, startDate: '2024-08-15', endDate: '2024-08-15', reason: 'ทำธุระที่อำเภอ', status: LeaveStatus.Pending, requestedAt: '2024-08-05T14:00:00Z' },
    { id: 'LR004', userId: 'EMP003', leaveType: LeaveType.Vacation, startDate: '2024-08-20', endDate: '2024-08-25', reason: 'ไปเที่ยวต่างประเทศ', status: LeaveStatus.Pending, requestedAt: '2024-08-02T11:00:00Z' },
    { id: 'LR005', userId: 'EMP002', leaveType: LeaveType.Sick, startDate: '2024-07-25', endDate: '2024-07-26', reason: 'ไข้หวัดใหญ่', status: LeaveStatus.Rejected, requestedAt: '2024-07-24T16:00:00Z' },
];

export const timeLogs: TimeLog[] = [
    { id: 'TL001', userId: 'EMP001', date: '2024-08-05', checkIn: '2024-08-05T08:55:00Z', checkOut: '2024-08-05T18:05:00Z', checkInLocation: { latitude: 13.7563, longitude: 100.5018 }, checkOutLocation: { latitude: 13.7563, longitude: 100.5018 } },
    { id: 'TL002', userId: 'EMP002', date: '2024-08-05', checkIn: '2024-08-05T09:15:00Z', checkOut: '2024-08-05T18:00:00Z', checkInLocation: { latitude: 13.7563, longitude: 100.5018 } },
    { id: 'TL003', userId: 'SUP001', date: '2024-08-05', checkIn: '2024-08-05T08:45:00Z', checkOut: '2024-08-05T18:30:00Z' },
];

// System-wide settings, configurable by the admin
export let systemSettings: SystemSettings = {
    officeLocation: { latitude: 13.7563, longitude: 100.5018 },
    checkInRadiusMeters: 200,
};
