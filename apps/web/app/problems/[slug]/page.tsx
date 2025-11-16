'use client';
import { use, useEffect } from 'react';
import Header from '@/components/Header';
import Left from './Left';
import Right from './Right';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';
import { useRouter } from 'next/navigation';

function ProblemDetails({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const router = useRouter();
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });
    const { data, isLoading, isError } = useQuery({
        queryKey: ['problems', slug],
        queryFn: () => api.problems.findOne(slug),
    });

    // protected route
    useEffect(() => {
        if (meQuery.isError && meQuery.fetchStatus === 'idle') {
            router.push('/login');
        }
    }, [meQuery.isError, router, meQuery.fetchStatus]);

    if (meQuery.isLoading) return <p>Loading...</p>;
    if (meQuery.isError) return null;

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError || 'ok' in data! || 'errors' in data!) {
        return <p>Something went wrong</p>;
    }

    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row">
                <Left data={data!} />
                <Right data={data!} />
            </div>
        </>
    );
}

export default ProblemDetails;
