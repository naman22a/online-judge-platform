import React from 'react';
import CreateProblemModal from './CreateProblemModal';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="font-semibold text-2xl">Admin Dashboard</h2>
            <CreateProblemModal />
        </div>
    );
};

export default AdminDashboard;
