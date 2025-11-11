'use client';
import { use } from 'react';
import Header from '@/components/Header';

function ProblemDetails({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    return (
        <div>
            <Header />
            <h1>ProblemDetails</h1>
            {slug}
        </div>
    );
}

export default ProblemDetails;
