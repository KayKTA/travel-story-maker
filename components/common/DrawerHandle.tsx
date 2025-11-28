'use client';

import { Box } from '@mui/material';
import { drawerHandle } from '@/styles';

interface DrawerHandleProps {
    width?: number;
}

export default function DrawerHandle({ width = 40 }: DrawerHandleProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
            <Box sx={{ ...drawerHandle, width }} />
        </Box>
    );
}
