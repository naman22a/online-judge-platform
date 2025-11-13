'use client';
import { use } from 'react';
import Header from '@/components/Header';
import Left from './Left';
import Right from './Right';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';

function ProblemDetails({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['problems', slug],
        queryFn: () => api.problems.findOne(slug),
    });

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
