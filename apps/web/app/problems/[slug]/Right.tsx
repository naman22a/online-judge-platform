import React from 'react';
import { IProblem } from '@/api/problems/types';
import { OkResponse } from '@leetcode/types';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';

interface Props {
    data: OkResponse | IProblem;
}

const sampleCode = `#include<iostream>
using namespace std;

int main(){
    
    return 0;
}
`;

const Right: React.FC<Props> = () => {
    const handleRun = () => {};
    const handleSubmit = () => {};

    return (
        <div className="w-full overflow-y-scroll md:w-1/2 p-5">
            <div className="mb-10">
                <Editor
                    height="70vh"
                    theme="vs-dark"
                    defaultLanguage="cpp"
                    defaultValue={sampleCode}
                />
            </div>
            <div className="flex gap-5">
                <Button
                    onClick={() => handleRun()}
                    className="bg-gray-500 hover:bg-gray-700 font-semibold"
                >
                    Run
                </Button>
                <Button
                    onClick={() => handleSubmit()}
                    className="bg-green-500 hover:bg-green-600 font-semibold"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default Right;
