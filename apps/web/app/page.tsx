'use client';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogoutButton from '@/components/LogoutButton';

function Home() {
    const router = useRouter();
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });

    // protected route
    useEffect(() => {
        if (meQuery.isError) {
            router.push('/login');
        }
    }, [meQuery.isError, router]);

    if (meQuery.isLoading) return <p>Loading...</p>;
    if (meQuery.isError) return null;

    return (
        <div>
            <h1>Leetcode</h1>
            <LogoutButton>Logout</LogoutButton>
            <pre>
                <code>{JSON.stringify(meQuery.data, null, 4)}</code>
            </pre>
        </div>
    );
}

export default Home;
