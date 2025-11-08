'use client';
import React from 'react';
import LogoutButton from './LogoutButton';

const Header: React.FC = () => {
    return (
        <header className="px-10 py-5 shadow flex items-center justify-between">
            <h1 className="font-semibold text-2xl">Leetcode</h1>
            <LogoutButton>Logout</LogoutButton>
        </header>
    );
};

export default Header;
