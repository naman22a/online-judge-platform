import { Metadata } from 'next';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/components/theme-provider';

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
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <Layout>{children}</Layout>
                </ThemeProvider>
            </body>
        </html>
    );
}
