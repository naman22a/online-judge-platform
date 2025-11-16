'use client';

import React, { useEffect, useState } from 'react';
import { IProblem } from '@/api/problems/types';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { getAccessToken } from '../../../global';
import { connectSocket, getSocket } from '../../../lib/socket';
import { Spinner } from '../../../components/ui/spinner';

interface Props {
    data: IProblem;
}

const sampleCode = `#include<iostream>
using namespace std;

int main(){
    
    return 0;
}`;

const Right: React.FC<Props> = ({ data }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = getAccessToken();
        if (!token) return;

        connectSocket();
        const socket = getSocket();
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
        });

        socket.on('execution-done', (data) => {
            setLoading(false);
            console.log('Execution:', data);
        });

        return () => {
            socket.disconnect();
        };
    }, [getAccessToken()]);

    const handleSubmit = () => {
        const socket = getSocket();
        if (!socket) return;

        setLoading(true);
        socket.emit('create-submission', {
            code: sampleCode,
            language: 'cpp',
            socketId: socket.id,
            problemId: data.id,
        });
    };

    return (
        <div className="w-full overflow-y-scroll md:w-1/2 p-5">
            <div className="mb-10">
                <Editor
                    height="50vh"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    defaultLanguage="cpp"
                    defaultValue={sampleCode}
                />
            </div>
            <div className="flex gap-5">
                <Button
                    onClick={() => handleSubmit()}
                    className="text-white bg-green-500 hover:bg-green-600 font-semibold"
                >
                    {loading && <Spinner />}
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default Right;
