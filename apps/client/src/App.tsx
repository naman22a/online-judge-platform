import React from 'react';
import { Button } from '@/components/ui/button';

const App: React.FC = () => {
    return (
        <div className="flex flex-col gap-5 items-start p-5">
            <h1 className="font-semibold text-4xl">Leetcode</h1>
            <Button>Click Me</Button>
        </div>
    );
};

export default App;
