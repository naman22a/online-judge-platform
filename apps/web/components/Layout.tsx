'use client';

import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

interface Props extends PropsWithChildren {}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

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
