import React from 'react';
import CreateProblemForm from './CreateProblemForm';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="font-semibold text-2xl">Admin Dashboard</h2>
            <CreateProblemForm />
        </div>
    );
};

export default AdminDashboard;
