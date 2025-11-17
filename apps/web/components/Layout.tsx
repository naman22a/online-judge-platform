'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { useStore } from '../store';
import { LANG_CONFIGS } from '@leetcode/constants';

interface Props extends PropsWithChildren {}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

const Layout: React.FC<Props> = ({ children }) => {
    const setCode = useStore((state) => state.setCode);
    const language = useStore((state) => state.language);

    useEffect(() => {
        setCode(LANG_CONFIGS[language]?.defaultCode ?? '');
    }, [language]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster position="top-center" />
        </QueryClientProvider>
    );
};

export default Layout;
