'use client';

import { SpeedDial, SpeedDialAction, SpeedDialIcon, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { useDisclosure, useBreakpoint } from '@/lib/hooks';

export interface SpeedDialActionItem {
    icon: ReactNode;
    name: string;
    onClick: () => void;
}

interface ActionSpeedDialProps {
    actions: SpeedDialActionItem[];
    ariaLabel?: string;
    showOnDesktop?: boolean;
    sx?: SxProps<Theme>;
}

export default function ActionSpeedDial({
    actions,
    ariaLabel = 'Actions',
    showOnDesktop = false,
    sx,
}: ActionSpeedDialProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isMobile } = useBreakpoint();

    // Hide on desktop unless explicitly shown
    if (!isMobile && !showOnDesktop) return null;

    return (
        <SpeedDial
            ariaLabel={ariaLabel}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                ...sx,
            }}
            icon={<SpeedDialIcon />}
            open={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={() => {
                        onClose();
                        action.onClick();
                    }}
                />
            ))}
        </SpeedDial>
    );
}
