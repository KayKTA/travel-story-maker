'use client';

import { Box } from '@mui/material';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import AppFooter from '@/components/layout/AppFooter';

export default function HomePage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <HeroSection />
            <FeaturesSection />
            <CTASection />
            <AppFooter />
        </Box>
    );
}
