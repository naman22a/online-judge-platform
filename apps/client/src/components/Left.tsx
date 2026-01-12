import React from 'react';
import type { IProblem } from '@/api/problems/types';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Submissions from './Submissions';
import { useStore } from '@/store';

interface Props {
    data: IProblem;
}

const Left: React.FC<Props> = ({ data }) => {
    const { tabValue, setTabValue } = useStore();

    return (
        <div className="w-full md:w-1/2 p-5 relative">
            <Tabs defaultValue="account" value={tabValue}>
                <TabsList>
                    <TabsTrigger onClick={() => setTabValue('description')} value="description">
                        Description
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setTabValue('submissions')} value="submissions">
                        Submissions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="description">
                    <div className="flex flex-col gap-5 items-start md:overflow-y-scroll">
                        <h1 className="text-4xl font-semibold">{data.title}</h1>
                        <span
                            className={cn(
                                'font-semibold text-lg text-white px-6 py-2 rounded-full',
                                data.difficulty === 'Easy' && 'bg-green-500',
                                data.difficulty === 'Medium' && 'bg-amber-500',
                                data.difficulty === 'Hard' && 'bg-red-500',
                            )}
                        >
                            {data.difficulty.toUpperCase()}
                        </span>
                        <p>{data.description}</p>
                        <h2 className="font-semibold text-lg">Test cases</h2>
                        <div>
                            {data.testCases.map((testCase, index) => (
                                <div key={testCase.id}>
                                    <h3>Example {index + 1}</h3>
                                    <p className="my-2">Input: </p>
                                    <CodeBlock
                                        language="bash"
                                        filename="input.txt"
                                        code={testCase.input}
                                    />
                                    <p className="my-2">Output: </p>
                                    <CodeBlock
                                        language="bash"
                                        filename="output.txt"
                                        code={testCase.expectedOutput}
                                    />
                                    {testCase.explanation && (
                                        <p>Explaination: {testCase.explanation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {data.constraints && (
                            <>
                                <h2 className="font-semibold text-lg">Constraints</h2>
                                <pre>{data.constraints}</pre>
                            </>
                        )}
                        {data.problemTags.length > 0 && (
                            <>
                                <h2 className="font-semibold text-lg">Topics</h2>
                                <div>
                                    {data.problemTags.map((tag) => (
                                        <span key={tag.tag.id} className="m-2">
                                            {tag.tag.name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                        {data.hints.length > 0 && (
                            <>
                                <h2 className="font-semibold text-lg">Hints</h2>
                                <ul className="list-disc">
                                    {data.hints.map((hint, index) => (
                                        <li key={index}>{hint}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {data.problemCompanies.length > 0 && (
                            <>
                                <h2 className="font-semibold text-lg">Companies</h2>
                                <div className="list-disc">
                                    {data.problemCompanies.map((company) => (
                                        <span className="m-2" key={company.company.id}>
                                            {company.company.name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="submissions">
                    <Submissions id={data.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Left;
