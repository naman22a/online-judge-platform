import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface GlobalState {
    code: string;
    setCode: (code: string) => void;
    tabValue: 'description' | 'submissions';
    setTabValue: (tabValue: 'description' | 'submissions') => void;
    errors: string[];
    setErrors: (errors: string[]) => void;
    language: string;
    setLanguage: (language: string) => void;
}

export const useStore = create<GlobalState>()(
    subscribeWithSelector((set) => ({
        code: '',
        tabValue: 'description',
        language: 'cpp',
        errors: [],

        setCode: (code) => set({ code }),
        setTabValue: (tabValue) => set({ tabValue }),
        setErrors: (errors) => set({ errors }),
        setLanguage: (language) => set({ language }),
    })),
);
