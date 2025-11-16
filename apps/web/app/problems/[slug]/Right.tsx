'use client';

import React, { useEffect } from 'react';
import { IProblem } from '@/api/problems/types';
import { OkResponse } from '@leetcode/types';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { getAccessToken } from '../../../global';
import { connectSocket, getSocket } from '../../../lib/socket';

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

    useEffect(() => {
        const token = getAccessToken();
        if (!token) return;

        connectSocket();
        const s = getSocket();
        if (!s) return;

        s.on('connect', () => {
            console.log('Connected:', s.id);
        });

        return () => {
            s.disconnect();
        };
    }, [getAccessToken()]);

    const handleRun = () => {
        const socket = getSocket();
        if (!socket) return;

        socket.emit('create-submission', {
            code: sampleCode,
            language: 'cpp',
            socketId: socket.id,
            problemId: data.id,
        });
    };
    const handleSubmit = () => {};

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
                <Button onClick={() => handleRun()} className="font-semibold">
                    Run
                </Button>
                <Button
                    onClick={() => handleSubmit()}
                    className="text-white bg-green-500 hover:bg-green-600 font-semibold"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default Right;
