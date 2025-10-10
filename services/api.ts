
import { User, LeaveRequest, TimeLog, RoleType, SystemSettings, DashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs on a different port

const getAuthToken = () => localStorage.getItem('token');

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An API error occurred');
    }
    
    // For DELETE requests, response body might be empty
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
};

// --- Auth ---
// FIX: Added explicit return type for apiLogin.
export const apiLogin = (userId, password): Promise<{ token: string, user: User }> => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userId, password }),
});

export const apiRegister = (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});

// FIX: Added explicit return type for apiGetUserByLineId.
export const apiGetUserByLineId = (lineUserId: string): Promise<{ exists: true; user: User; token: string } | { exists: false }> => request(`/auth/line/${lineUserId}`);

// FIX: Added explicit return type for apiLineRegister.
export const apiLineRegister = (userData): Promise<{ token: string, user: User }> => request('/auth/line-register', {
    method: 'POST',
    body: JSON.stringify(userData),
});


// --- Leave Requests ---
export const apiGetMyLeaveRequests = (): Promise<LeaveRequest[]> => request('/leave/my-requests');

export const apiCreateLeaveRequest = (leaveData: Omit<LeaveRequest, 'id' | 'userId' | 'status' | 'requestedAt'>): Promise<LeaveRequest> => request('/leave', {
    method: 'POST',
    body: JSON.stringify(leaveData),
});

// --- For Managers/Approvers ---
export const apiGetPendingApprovals = (): Promise<LeaveRequest[]> => request('/leave/pending-approvals');

export const apiUpdateLeaveStatus = (requestId: string, status: 'Approved' | 'Rejected'): Promise<LeaveRequest> => request(`/leave/${requestId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
});


// --- Time Logs ---
export const apiGetTodayLog = (): Promise<TimeLog | null> => request('/timelog/today');

export const apiCheckIn = (location: { latitude: number, longitude: number }): Promise<TimeLog> => request('/timelog/check-in', {
    method: 'POST',
    body: JSON.stringify({ location }),
});

export const apiCheckOut = (location: { latitude: number, longitude: number }): Promise<TimeLog> => request('/timelog/check-out', {
    method: 'PUT',
    body: JSON.stringify({ location }),
});


// --- Dashboard ---
// FIX: Added explicit return type for apiGetDashboardStats.
export const apiGetDashboardStats = (): Promise<DashboardStats> => request('/admin/dashboard-stats');


// --- Admin ---
export const apiGetAllUsers = (): Promise<User[]> => request('/users');
export const apiAddUser = (userData: User): Promise<User> => request('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
});
export const apiDeleteUser = (userId: string): Promise<void> => request(`/users/${userId}`, {
    method: 'DELETE',
});

export const apiGetAllTimeLogs = (): Promise<TimeLog[]> => request('/timelog/all');
export const apiUpdateTimeLog = (logId: string, logData: Partial<TimeLog>): Promise<TimeLog> => request(`/timelog/${logId}`, {
    method: 'PUT',
    body: JSON.stringify(logData),
});

export const apiGetAllRoles = (): Promise<RoleType[]> => request('/admin/roles');
export const apiAddRole = (roleData: RoleType): Promise<RoleType> => request('/admin/roles', {
    method: 'POST',
    body: JSON.stringify(roleData),
});
export const apiUpdateRole = (roleName: string, roleData: RoleType): Promise<RoleType> => request(`/admin/roles/${encodeURIComponent(roleName)}`, {
    method: 'PUT',
    body: JSON.stringify(roleData),
});
export const apiDeleteRole = (roleName: string): Promise<void> => request(`/admin/roles/${encodeURIComponent(roleName)}`, {
    method: 'DELETE',
});


export const apiGetSystemSettings = (): Promise<SystemSettings> => request('/admin/settings');
export const apiUpdateSystemSettings = (settings: SystemSettings): Promise<SystemSettings> => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
});
