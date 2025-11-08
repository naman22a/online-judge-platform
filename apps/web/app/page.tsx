'use client';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { setAccessToken } from '@/global';
import { useQueryClient } from '@tanstack/react-query';
import * as api from '@/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Home() {
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });
    const queryClient = useQueryClient();
    const logoutMut = useMutation({ mutationKey: ['auth', 'logout'], mutationFn: api.auth.logout });
    const router = useRouter();

    useEffect(() => {
        if (meQuery.isError) {
            router.push('/login');
        }
    }, [meQuery.isError, router]);

    const handleLogout = async () => {
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
        } catch (error) {}
    };

    console.log(meQuery.isError);

    if (meQuery.isLoading) return <p>Loading...</p>;
    if (meQuery.isError) return null;

    return (
        <div>
            <h1>Leetcode</h1>
            <Button onClick={() => handleLogout()}>Logout</Button>
            <pre>
                <code>{JSON.stringify(meQuery.data, null, 4)}</code>
            </pre>
        </div>
    );
}

export default Home;
