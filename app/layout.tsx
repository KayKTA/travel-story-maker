import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: 'Travel Story Maker',
        template: '%s | Travel Story Maker',
    },
    description: 'Enregistrez vos voyages, tenez un journal, suivez vos dépenses et créez des stories de voyage avec l\'IA.',
    keywords: ['voyage', 'journal', 'travel', 'story', 'photos', 'dépenses', 'carte'],
    authors: [{ name: 'Travel Story Maker' }],
    creator: 'Travel Story Maker',
    robots: 'noindex, nofollow', // Private app
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0F766E',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={inter.variable}>
            <body>
                <Providers>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </Providers>
            </body>
        </html>
    );
}
