import React, { useEffect, useState } from 'react';
import type { IProblem } from '@/api/problems/types';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
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
import { LANG_CONFIGS } from '@/constants';
import { cn } from '../lib/utils';

interface Props {
    data: IProblem;
}

export interface ExecutionResult {
    success: boolean;
    output: string;
}

const Right: React.FC<Props> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ExecutionResult[]>([]);
    const queryClient = useQueryClient();
    const { language, code, setCode, setLanguage } = useStore();

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

            const results = res as ExecutionResult[];
            setResults(res as ExecutionResult[]);
            let solved = true;
            for (let result of results) {
                if (!result.success) {
                    solved = false;
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

        setResults([]);
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
                    theme="vs-dark"
                    language={language}
                    value={code}
                    onChange={(e) => {
                        setCode(e!);
                        setResults([]);
                    }}
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
            {results.length > 0 && (
                <div className="my-2">
                    {results.map((result, index) => (
                        <div
                            className={cn(
                                'p-5 my-2 rounded',
                                result.success ? 'bg-green-500' : 'bg-red-500',
                            )}
                        >
                            <h3 className="font-semibold text-lg">Test Case {index + 1}</h3>
                            <span className="font-semibold">Your Output:</span> {result.output}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Right;
