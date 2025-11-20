import React from 'react';
import LogoutButton from './LogoutButton';
import { ModeToggle } from './mode-toggle';

const Header: React.FC = () => {
    return (
        <header className="shadow py-5 px-10 flex items-center justify-between">
            <h1 className="font-semibold text-4xl">Leetcode</h1>
            <div className="flex items-center gap-5">
                <ModeToggle />
                <LogoutButton>Logout</LogoutButton>
            </div>
        </header>
    );
};

export default Header;
