import { useEffect } from 'react';
import Header from '@/components/Header';
import Left from '@/components/Left';
import Right from '@/components/Right';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ProblemDetails() {
    const { slug } = useParams();

    const navigate = useNavigate();
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });
    const { data, isLoading, isError } = useQuery({
        queryKey: ['problems', slug],
        queryFn: () => api.problems.findOne(slug!),
    });

    // protected route
    useEffect(() => {
        if (meQuery.isError && meQuery.fetchStatus === 'idle') {
            navigate('/login');
        }
    }, [meQuery.isError, navigate, meQuery.fetchStatus]);

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
