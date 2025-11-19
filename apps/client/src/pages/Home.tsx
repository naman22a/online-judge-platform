import React, { useEffect } from 'react';
import * as api from '@/api';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProblemsList from '@/components/ProblemsList';
import AdminDashboard from '@/components/AdminDashboard';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });

    // protected route
    useEffect(() => {
        if (meQuery.isError && meQuery.fetchStatus === 'idle') {
            navigate('/login');
        }
    }, [meQuery.isError, navigate, meQuery.fetchStatus]);

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
};

export default Home;
