'use client';

import { ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Link from 'next/link';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 4,
                textAlign: 'center',
            }}
        >
            {icon && (
                <Box
                    sx={{
                        color: 'grey.400',
                        mb: 2,
                    }}
                >
                    {icon}
                </Box>
            )}

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, maxWidth: 400 }}
                >
                    {description}
                </Typography>
            )}

            {(actionLabel && (actionHref || onAction)) && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAction}
                    {...(actionHref && {
                        component: Link,
                        href: actionHref,
                    })}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}
