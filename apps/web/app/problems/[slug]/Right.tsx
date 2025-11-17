'use client';

import React, { useEffect, useState } from 'react';
import { IProblem } from '@/api/problems/types';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { getAccessToken, languages } from '@/global';
import { connectSocket, getSocket } from '@/lib/socket';
import { Spinner } from '@/components/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useStore } from '@/store';
import { LANG_CONFIGS } from '@leetcode/constants';

interface Props {
    data: IProblem;
}

const Right: React.FC<Props> = ({ data }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const { language, code, setCode, setLanguage, errors, setErrors } = useStore();

    useEffect(() => {
        const token = getAccessToken();
        if (!token) return;

        connectSocket();
        const socket = getSocket();
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
        });

        socket.on('execution-done', (res) => {
            setLoading(false);
            queryClient.invalidateQueries({ queryKey: ['submissions'] });

            const results = res as any;
            let solved = true;
            for (let result of results) {
                if (!result.success) {
                    solved = false;
                    setErrors([...errors, result.output]);
                }
            }
            if (solved) {
                toast.success('Solved');
            } else {
                toast.error('Try again');
            }
        });

        return () => {
            socket.disconnect();
            socket.off('connect');
            socket.off('execution-done');
        };
    }, [getAccessToken()]);

    const handleSubmit = () => {
        const socket = getSocket();
        if (!socket) return;

        console.log(code, language, socket.id, data.id);
        setErrors([]);
        setLoading(true);
        socket.emit('create-submission', {
            code,
            language,
            socketId: socket.id,
            problemId: data.id,
        });
    };

    return (
        <div className="w-full overflow-y-scroll md:w-1/2 p-5">
            Language:{' '}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{language}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => {
                                setCode(LANG_CONFIGS[lang]?.defaultCode ?? '');
                                setLanguage(lang);
                            }}
                        >
                            {lang}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="mb-10">
                <Editor
                    height="50vh"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    language={language}
                    value={code}
                    onChange={(e) => setCode(e!)}
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
            {errors.length > 0 && (
                <div className="text-red-500 my-2">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Right;
