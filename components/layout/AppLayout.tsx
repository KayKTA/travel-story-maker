'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    Avatar,
    Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Luggage as LuggageIcon,
    ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Accueil', href: '/', icon: <HomeIcon /> },
    { label: 'Mes Voyages', href: '/trips', icon: <LuggageIcon /> },
];

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const theme = useTheme();
    const pathname = usePathname();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCollapseToggle = () => {
        setCollapsed(!collapsed);
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo / Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    p: 2,
                    minHeight: 64,
                }}
            >
                {!collapsed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 36,
                                height: 36,
                                fontSize: '1rem',
                            }}
                        >
                            ✈️
                        </Avatar>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: 'primary.main' }}
                        >
                            Travel Story
                        </Typography>
                    </Box>
                )}
                {!isMobile && (
                    <IconButton onClick={handleCollapseToggle} size="small">
                        <ChevronLeftIcon
                            sx={{
                                transform: collapsed ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s',
                            }}
                        />
                    </IconButton>
                )}
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1, px: 1 }}>
                {NAV_ITEMS.map((item) => (
                    <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                        <Tooltip title={collapsed ? item.label : ''} placement="right">
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{
                                    borderRadius: 2,
                                    minHeight: 48,
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    px: collapsed ? 2 : 2.5,
                                    bgcolor: isActive(item.href)
                                        ? 'primary.main'
                                        : 'transparent',
                                    color: isActive(item.href) ? 'white' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive(item.href)
                                            ? 'primary.dark'
                                            : 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: collapsed ? 0 : 40,
                                        color: 'inherit',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!collapsed && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive(item.href) ? 600 : 400,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            {/* Footer */}
            {!collapsed && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                        Travel Story Maker v1.0
                    </Typography>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile AppBar */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: 1,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem',
                                mr: 1,
                            }}
                        >
                            ✈️
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Travel Story
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{
                    width: { md: drawerWidth },
                    flexShrink: { md: 0 },
                }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            overflowX: 'hidden',
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    pt: { xs: 8, md: 0 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
