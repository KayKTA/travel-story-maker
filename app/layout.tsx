import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import Providers from './providers';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';

const dmSans = DM_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dm-sans',
    weight: ['400', '500', '600', '700'],
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
    themeColor: '#F5B82E',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={dmSans.variable}>
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
