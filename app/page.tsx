'use client';

import { Box } from '@mui/material';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AppFooter from '@/components/layout/AppFooter';
import HowItWorks from '@/components/home/HowItWorks';

export default function HomePage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            {/* <AppFooter /> */}
        </Box>
    );
}
