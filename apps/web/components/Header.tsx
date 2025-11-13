'use client';
import React from 'react';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    return (
        <header className="px-10 py-5 shadow flex items-center justify-between">
            <h1 className="font-semibold text-2xl">Leetcode</h1>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <LogoutButton>Logout</LogoutButton>
            </div>
        </header>
    );
};

export default Header;
