import React from 'react';
import LogoutButton from './LogoutButton';
import { ModeToggle } from './mode-toggle';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';

const Header: React.FC = () => {
    const meQuery = useQuery({ queryKey: ['users', 'me'], queryFn: api.users.me });

    return (
        <header className="shadow py-5 px-10 flex items-center justify-between">
            <Link to="/">
                <h1 className="font-semibold text-4xl">Leetcode</h1>
            </Link>
            <div className="flex items-center gap-5">
                <h2>
                    @<span className="font-semibold text-lg">{meQuery.data?.username}</span>
                </h2>
                <ModeToggle />
                <LogoutButton>Logout</LogoutButton>
            </div>
        </header>
    );
};

export default Header;
