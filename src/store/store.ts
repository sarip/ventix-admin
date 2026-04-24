import { create } from 'zustand';

interface User {
    id: number | undefined;
    username: string;
    role: string;
    fullname: string;
}

interface UserState {
    user: User;
    setUser: (user: Partial<User>) => void; // Partial agar bisa set sebagian
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: {
        id: undefined,
        username: '',
        role: '',
        fullname: '',
    },
    setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })), // ✅ Bisa update sebagian
    clearUser: () => set({
        user: {
            id: undefined,
            username: '',
            role: '',
            fullname: '',
        }
    }), // ✅ Reset ke nilai default
}));
