'use client';

import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { useStore } from '../store';
import { LANG_CONFIGS } from '@leetcode/constants';

interface Props extends PropsWithChildren {}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

useStore.subscribe(
    (state) => state.language,
    (language) => {
        useStore.setState({
            code: LANG_CONFIGS[language]?.defaultCode ?? '',
        });
    },
);

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster position="top-center" />
        </QueryClientProvider>
    );
};

export default Layout;
