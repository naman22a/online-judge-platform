'use client';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProblemsList from '@/components/ProblemsList';
import Header from '@/components/Header';

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
        <>
            <Header />
            <div className="p-5">
                {meQuery.data?.is_admin ? <AdminDashboard /> : <ProblemsList />}
            </div>
        </>
    );
}

export default Home;
