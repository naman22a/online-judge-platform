import React from 'react';
import LogoutButton from './LogoutButton';

const Header: React.FC = () => {
    return (
        <header className="shadow py-5 px-10 flex items-center justify-between">
            <h1 className="font-semibold text-4xl">Leetcode</h1>
            <LogoutButton>Logout</LogoutButton>
        </header>
    );
};

export default Header;
