'use client';
import React, { PropsWithChildren, useState } from 'react';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAccessToken } from '@/global';
import * as api from '@/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props extends PropsWithChildren {}

const LogoutButton: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const logoutMut = useMutation({ mutationKey: ['auth', 'logout'], mutationFn: api.auth.logout });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const res = await logoutMut.mutateAsync();
            if (res.ok && !res.errors) {
                toast.success('Logged out');
                setAccessToken('');
                await queryClient.invalidateQueries({ queryKey: ['users', 'me'], exact: true });
                router.push('/login');
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return <Button onClick={() => handleLogout()}>{isLoading ? 'Loading...' : children}</Button>;
};

export default LogoutButton;
