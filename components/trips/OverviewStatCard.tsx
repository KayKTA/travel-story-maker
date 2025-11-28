'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface OverviewStatCardProps {
    value: ReactNode;
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'error';
    onClick?: () => void;
}

export default function OverviewStatCard({
    value,
    label,
    color = 'default',
    onClick,
}: OverviewStatCardProps) {
    const textColor =
        color === 'default'
            ? 'text.primary'
            : (`${color}.main` as
                  | 'primary.main'
                  | 'secondary.main'
                  | 'success.main'
                  | 'error.main');

    return (
        <Card
            variant="outlined"
            onClick={onClick}
            sx={(theme) => ({
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                borderRadius: theme.shape.borderRadius,
                boxShadow: 'none',
                transition: theme.transitions.create(['background-color', 'transform'], {
                    duration: theme.transitions.duration.shorter,
                }),
                '&:hover': onClick
                    ? {
                          backgroundColor: theme.palette.action.hover,
                          transform: 'translateY(-2px)',
                      }
                    : undefined,
            })}
        >
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: textColor }}
                >
                    {value}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                >
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
}
