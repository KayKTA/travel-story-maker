'use client';

import { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Button, Skeleton } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    action?: {
        label: string;
        icon?: ReactNode;
        onClick?: () => void;
        href?: string;
    };
    secondaryAction?: {
        label: string;
        icon?: ReactNode;
        onClick?: () => void;
        href?: string;
    };
    loading?: boolean;
    children?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    action,
    secondaryAction,
    loading,
    children,
}: PageHeaderProps) {
    return (
        <Box
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3 },
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 1.5 }}
                >
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        if (isLast || !item.href) {
                            return (
                                <Typography
                                    key={index}
                                    color={isLast ? 'text.primary' : 'text.secondary'}
                                    variant="body2"
                                    sx={{ fontWeight: isLast ? 500 : 400 }}
                                >
                                    {item.label}
                                </Typography>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                style={{ textDecoration: 'none' }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        '&:hover': {
                                            color: 'primary.main',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            )}

            {/* Title row */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box>
                    {loading ? (
                        <>
                            <Skeleton variant="text" width={250} height={40} />
                            {subtitle && <Skeleton variant="text" width={180} height={24} />}
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{ fontWeight: 700, color: 'text.primary' }}
                            >
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </>
                    )}
                </Box>

                {/* Actions */}
                {(action || secondaryAction) && (
                    <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
                        {secondaryAction && (
                            <Button
                                variant="outlined"
                                startIcon={secondaryAction.icon}
                                onClick={secondaryAction.onClick}
                                {...(secondaryAction.href && {
                                    component: Link,
                                    href: secondaryAction.href,
                                })}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                        {action && (
                            <Button
                                variant="contained"
                                startIcon={action.icon}
                                onClick={action.onClick}
                                {...(action.href && {
                                    component: Link,
                                    href: action.href,
                                })}
                            >
                                {action.label}
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            {/* Additional content */}
            {children && <Box sx={{ mt: 2 }}>{children}</Box>}
        </Box>
    );
}
