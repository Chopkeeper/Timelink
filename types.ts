export enum Role {
    Employee = 'Employee',
    Supervisor = 'Supervisor',
    Manager = 'Manager',
    Admin = 'Admin',
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
    role: Role;
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

export interface TimeLog {
    id: string;
    userId: string;
    checkIn: string | null;
    checkOut: string | null;
    date: string;
}