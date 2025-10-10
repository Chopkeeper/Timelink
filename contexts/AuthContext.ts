
import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    // FIX: Updated function signatures to return Promises to reflect their async nature.
    login: (userId: string, password?: string) => Promise<void>;
    logout: () => void;
    // FIX: Updated findUserByLineId to return a Promise with a structured object, matching the async implementation.
    findUserByLineId: (lineUserId: string) => Promise<{ exists: boolean; user?: User; token?: string; }>;
    registerAndLogin: (userData: Omit<User, 'avatar' | 'role' | 'password'>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    // FIX: Updated default context values to be async functions.
    login: async () => {},
    logout: () => {},
    findUserByLineId: async () => ({ exists: false }),
    registerAndLogin: async () => {},
});
