'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);
    return (
        <html>
            <body>
                <h2>Global Error: Something went wrong</h2>
                <button onClick={() => reset()}>Retry</button>
            </body>
        </html>
    );
}
