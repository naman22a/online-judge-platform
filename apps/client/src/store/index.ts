import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { LANG_CONFIGS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface GlobalState {
    code: string;
    setCode: (code: string) => void;
    tabValue: 'description' | 'submissions';
    setTabValue: (tabValue: 'description' | 'submissions') => void;
    language: string;
    setLanguage: (language: string) => void;
    idempotencyKey: string;
    resetIdempotencyKey: () => void;
}

export const useStore = create<GlobalState>()(
    subscribeWithSelector((set) => ({
        code: LANG_CONFIGS['cpp'].defaultCode ?? '',
        tabValue: 'description',
        language: 'cpp',
        idempotencyKey: uuidv4(),

        setCode: (code) => set({ code }),
        setTabValue: (tabValue) => set({ tabValue }),
        setLanguage: (language) => set({ language }),
        resetIdempotencyKey: () => set(() => ({ idempotencyKey: uuidv4() })),
    })),
);
