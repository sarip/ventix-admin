import { create } from 'zustand';

interface User {
    id: number | undefined;
    username: string;
    scope: string;
    fullname: string;
    level: string;
    property_id: string;
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
        scope: '',
        fullname: '',
        level: '',
        property_id: '',
    },
    setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })), // ✅ Bisa update sebagian
    clearUser: () => set({
        user: {
            id: undefined,
            username: '',
            scope: '',
            fullname: '',
            level: '',
            property_id: ''
        }
    }), // ✅ Reset ke nilai default
}));
