'use client';

import { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Button, Skeleton, IconButton } from '@mui/material';
import { NavigateNext as NavigateNextIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    backHref?: string;
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
    backHref,
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
                bgcolor: '#1A1A1A',
                color: '#F5B82E',
            }}
        >
            {/* Back button */}
            {backHref && (
                <IconButton
                    component={Link}
                    href={backHref}
                    size="small"
                    sx={{
                        mb: 1,
                        ml: -1,
                        color: '#F5B82E',
                        bgcolor: 'rgba(245, 184, 46, 0.1)',
                        '&:hover': { bgcolor: 'rgba(245, 184, 46, 0.2)' },
                    }}
                >
                    <BackIcon />
                </IconButton>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(245, 184, 46, 0.5)' }} />}
                    sx={{ mb: 1.5 }}
                >
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        if (isLast || !item.href) {
                            return (
                                <Typography
                                    key={index}
                                    color={isLast ? '#F5B82E' : 'rgba(245, 184, 46, 0.7)'}
                                    variant="body2"
                                    sx={{ fontWeight: isLast ? 700 : 500 }}
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
                                    sx={{
                                        color: 'rgba(245, 184, 46, 0.7)',
                                        fontWeight: 500,
                                        '&:hover': {
                                            color: '#F5B82E',
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
                            <Skeleton variant="text" width={250} height={40} sx={{ bgcolor: 'rgba(245, 184, 46, 0.1)' }} />
                            {subtitle && <Skeleton variant="text" width={180} height={24} sx={{ bgcolor: 'rgba(245, 184, 46, 0.1)' }} />}
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{ fontWeight: 800, color: '#F5B82E' }}
                            >
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 0.5, color: 'rgba(245, 184, 46, 0.7)' }}
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
                                sx={{
                                    borderColor: '#F5B82E',
                                    color: '#F5B82E',
                                    borderWidth: 2,
                                    fontWeight: 700,
                                    '&:hover': {
                                        borderColor: '#F5B82E',
                                        bgcolor: 'rgba(245, 184, 46, 0.1)',
                                        borderWidth: 2,
                                    },
                                }}
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
                                sx={{
                                    bgcolor: '#F5B82E',
                                    color: '#1A1A1A',
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: '#FFD466' },
                                }}
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
