'use client';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogoutButton from '@/components/LogoutButton';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProblemsList from '@/components/ProblemsList';

function Home() {
    const router = useRouter();
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });

    // protected route
    useEffect(() => {
        if (meQuery.isError && meQuery.fetchStatus === 'idle') {
            router.push('/login');
        }
    }, [meQuery.isError, router, meQuery.fetchStatus]);

    if (meQuery.isLoading) return <p>Loading...</p>;
    if (meQuery.isError) return null;

    return (
        <div>
            <h1>Leetcode</h1>
            <LogoutButton>Logout</LogoutButton>
            {meQuery.data?.is_admin ? <AdminDashboard /> : <ProblemsList />}
        </div>
    );
}

export default Home;
