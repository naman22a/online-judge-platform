import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ConfirmEmail from './pages/ConfirmEmail';
import ProblemDetails from './pages/ProblemDetails';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/confirm/:token" element={<ConfirmEmail />} />
                    <Route path="/problems/:slug" element={<ProblemDetails />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-center" />
        </QueryClientProvider>
    );
};

export default App;
