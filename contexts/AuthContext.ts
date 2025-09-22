import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    login: (userId: string, password?: string) => void;
    logout: () => void;
    findUserByLineId: (lineUserId: string) => User | null;
    registerAndLogin: (userData: Omit<User, 'avatar' | 'role' | 'password'>) => void;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => {},
    logout: () => {},
    findUserByLineId: () => null,
    registerAndLogin: () => {},
});