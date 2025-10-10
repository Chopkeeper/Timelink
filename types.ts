
export interface RoleType {
    name: string;
    level: number;
}

export enum LeaveType {
    Sick = 'ลาป่วย',
    Personal = 'ลากิจ',
    Maternity = 'ลาคลอด',
    Vacation = 'ลาพักร้อน',
    Ordination = 'ลาอุปสมบท',
}

export enum LeaveStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export interface User {
    id: string;
    name: string;
    nationalId: string;
    professionalId: string;
    department: string;
    avatar: string;
    role: string;
    lineUserId?: string;
    password?: string;
    supervisorId?: string;
    managerId?: string;
}

export interface LeaveRequest {
    id: string;
    userId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    requestedAt: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface TimeLog {
    id: string;
    userId: string;
    checkIn: string | null;
    checkOut: string | null;
    date: string;
    checkInLocation?: Location;
    checkOutLocation?: Location;
}

export interface SystemSettings {
    officeLocation: Location;
    checkInRadiusMeters: number;
}

// FIX: Add DashboardStats interface to be shared across the application.
export interface DashboardStats {
    lateArrivals: { name: string; time: string; avatar: string; }[];
    leaveData: { name: string; count: number; }[];
    teamMemberCount: number;
    pendingApprovals: number;
    leavesToday: number;
}
