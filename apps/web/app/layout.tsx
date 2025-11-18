import { Metadata } from 'next';
import '@/styles/globals.css';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
    title: 'Leetcode',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
}
