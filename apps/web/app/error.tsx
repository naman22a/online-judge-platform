'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold">Something went wrong.</h2>
            <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-black text-white rounded">
                Try again
            </button>
        </div>
    );
}
