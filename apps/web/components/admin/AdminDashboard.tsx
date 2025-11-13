import React from 'react';
import CreateProblemModal from './CreateProblemModal';
import AdminProblemsList from './AdminProblemsList';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="font-semibold text-2xl">Admin Dashboard</h2>
            <CreateProblemModal />
            <AdminProblemsList />
        </div>
    );
};

export default AdminDashboard;
