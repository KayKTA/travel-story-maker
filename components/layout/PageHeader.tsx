'use client';

import { ReactNode } from 'react';
import {
    Box,
    Typography,
    Breadcrumbs,
    Button,
    Skeleton,
    IconButton,
} from '@mui/material';
import {
    NavigateNext as NavigateNextIcon,
    ArrowBack as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { tokens, flexBetween } from '@/styles';

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
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 3, sm: 4 },
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
            }}
        >
            {/* Back button */}
            {backHref && (
                <IconButton
                    component={Link}
                    href={backHref}
                    size="small"
                    sx={{
                        mb: 1.5,
                        ml: -1,
                        color: 'primary.contrastText',
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.15)' },
                    }}
                >
                    <BackIcon />
                </IconButton>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={
                        <NavigateNextIcon
                            fontSize="small"
                            sx={{ color: 'rgba(0, 0, 0, 0.4)' }}
                        />
                    }
                    sx={{ mb: 2 }}
                >
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        if (isLast || !item.href) {
                            return (
                                <Typography
                                    key={index}
                                    color={isLast ? 'primary.contrastText' : 'rgba(0, 0, 0, 0.6)'}
                                    variant="body2"
                                    sx={{ fontWeight: isLast ? tokens.fontWeights.semibold : tokens.fontWeights.medium }}
                                >
                                    {item.label}
                                </Typography>
                            );
                        }

                        return (
                            <Link key={index} href={item.href} style={{ textDecoration: 'none' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        fontWeight: tokens.fontWeights.medium,
                                        '&:hover': {
                                            color: 'primary.contrastText',
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
                            <Skeleton
                                variant="text"
                                width={250}
                                height={40}
                                sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)' }}
                            />
                            {subtitle && (
                                <Skeleton
                                    variant="text"
                                    width={180}
                                    height={24}
                                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)' }}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{ fontWeight: tokens.fontWeights.bold, color: 'primary.contrastText' }}
                            >
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 0.5, color: 'rgba(0, 0, 0, 0.7)' }}
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
                                    borderColor: 'primary.contrastText',
                                    color: 'primary.contrastText',
                                    borderWidth: 1.5,
                                    fontWeight: tokens.fontWeights.medium,
                                    '&:hover': {
                                        borderColor: 'primary.contrastText',
                                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                                        borderWidth: 1.5,
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
                                    bgcolor: 'primary.contrastText',
                                    color: 'primary.main',
                                    fontWeight: tokens.fontWeights.medium,
                                    '&:hover': { bgcolor: 'background.paper' },
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
            {children && <Box sx={{ mt: 3 }}>{children}</Box>}
        </Box>
    );
}
