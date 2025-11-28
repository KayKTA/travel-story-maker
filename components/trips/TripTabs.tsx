'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Divider,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Explore as ExploreIcon,
    Photo as PhotoIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import JournalMapView from './JournalMapView';
import MediaGallery from '@/components/media/MediaGallery';
import ExpenseList from '@/components/expenses/ExpenseList';
import { formatCurrency, getDurationDays } from '@/lib/utils/formatters';
import { TRIP_MOODS } from '@/types/trip';
import { useBreakpoint } from '@/lib/hooks';
import { tokens } from '@/styles';
import OverviewStatCard from './OverviewStatCard';
import type {
    Trip,
    JournalEntryWithMedia,
    MediaAsset,
    Expense,
    Story,
} from '@/types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`trip-tabpanel-${index}`}
            aria-labelledby={`trip-tab-${index}`}
        >
            {value === index && <Box sx={{ py: { xs: 2, sm: 3 } }}>{children}</Box>}
        </Box>
    );
}

interface TripTabsProps {
    trip: Trip;
    journalEntries: JournalEntryWithMedia[];
    media: MediaAsset[];
    expenses: Expense[];
    stories: Story[];
    stats: {
        journalCount: number;
        photosCount: number;
        videosCount: number;
        totalExpenses: number;
        storiesCount: number;
    };
    onRefresh?: () => void;
}

export default function TripTabs({
    trip,
    journalEntries,
    media,
    expenses,
    stories,
    stats,
    onRefresh,
}: TripTabsProps) {
    const { isMobile } = useBreakpoint();
    const [currentTab, setCurrentTab] = useState(0);

    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);
    const durationDays = getDurationDays(trip.start_date, trip.end_date);
    const entriesWithGps = useMemo(
        () => journalEntries.filter((e) => e.lat && e.lng).length,
        [journalEntries]
    );

    const avgPerDay =
        durationDays && stats.totalExpenses > 0
            ? stats.totalExpenses / durationDays
            : 0;

    const latestEntries = journalEntries
        .slice()
        .sort(
            (a, b) =>
                new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
        )
        .slice(0, 3);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const tabs = [
        { icon: <DashboardIcon />, label: 'Aperçu', count: null },
        { icon: <ExploreIcon />, label: 'Itinéraire', count: stats.journalCount },
        {
            icon: <PhotoIcon />,
            label: 'Médias',
            count: stats.photosCount + stats.videosCount,
        },
        { icon: <ReceiptIcon />, label: 'Dépenses', count: expenses.length },
    ];

    return (
        <Box>
            {/* Tabs Navigation */}
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    position: 'sticky',
                    top: { xs: 88, sm: 72 },
                    zIndex: 5,
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{
                        minHeight: { xs: 48, sm: 52 },
                        '& .MuiTabs-indicator': {
                            height: 2,
                            borderRadius: 999,
                        },
                        '& .MuiTab-root': {
                            minHeight: { xs: 48, sm: 52 },
                            minWidth: { xs: 'auto', sm: 140 },
                            px: { xs: 1.5, sm: 3 },
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            fontWeight: 600,
                        },
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            icon={
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {tab.icon}
                                    {tab.count !== null && tab.count > 0 && isMobile && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -4,
                                                right: -8,
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                fontSize: 10,
                                                fontWeight: tokens.fontWeights.bold,
                                                borderRadius: '50%',
                                                width: 16,
                                                height: 16,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {tab.count > 99 ? '99+' : tab.count}
                                        </Box>
                                    )}
                                </Box>
                            }
                            iconPosition="start"
                            label={
                                isMobile
                                    ? undefined
                                    : `${tab.label}${
                                          tab.count !== null ? ` (${tab.count})` : ''
                                      }`
                            }
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ px: { xs: 2, sm: 3 } }}>
                {/* OVERVIEW */}
                <TabPanel value={currentTab} index={0}>
                    <Stack spacing={3}>
                        {/* Stat row */}
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <OverviewStatCard
                                    value={durationDays}
                                    label="jours de voyage"
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <OverviewStatCard
                                    value={stats.journalCount}
                                    label="étapes"
                                    color="primary"
                                    onClick={() => setCurrentTab(1)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <OverviewStatCard
                                    value={stats.photosCount + stats.videosCount}
                                    label="médias"
                                    color="secondary"
                                    onClick={() => setCurrentTab(2)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <OverviewStatCard
                                    value={formatCurrency(stats.totalExpenses)}
                                    label={
                                        avgPerDay
                                            ? `dépensés (≈ ${formatCurrency(
                                                  avgPerDay
                                              )}/jour)`
                                            : 'dépensés'
                                    }
                                    color="error"
                                    onClick={() => setCurrentTab(3)}
                                />
                            </Grid>
                        </Grid>

                        {/* Résumé du voyage */}
                        <Card variant="outlined">
                            <CardContent sx={{ py: { xs: 2, sm: 2.5 } }}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        {moodData && (
                                            <Chip
                                                label={`${moodData.emoji} ${moodData.label}`}
                                                size="small"
                                                sx={{
                                                    mb: 1.5,
                                                    bgcolor: 'primary.main',
                                                    color: 'primary.contrastText',
                                                    fontWeight:
                                                        tokens.fontWeights.medium,
                                                }}
                                            />
                                        )}
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            À propos de ce voyage
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {trip.description ||
                                                "Ajoutez une description pour garder le contexte de ce voyage."}
                                        </Typography>
                                    </Box>

                                    {entriesWithGps > 0 && (
                                        <Box
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                borderRadius: 2,
                                                bgcolor: 'background.default',
                                                border: 1,
                                                borderColor: 'divider',
                                                cursor: 'pointer',
                                                minWidth: { xs: '100%', sm: 220 },
                                            }}
                                            onClick={() => setCurrentTab(1)}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <ExploreIcon
                                                    fontSize="small"
                                                    color="action"
                                                />
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        Itinéraire sur la carte
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {entriesWithGps} étape
                                                        {entriesWithGps > 1 ? 's' : ''} géolocalisée
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Activité récente */}
                        {latestEntries.length > 0 && (
                            <Card variant="outlined">
                                <CardContent sx={{ py: { xs: 2, sm: 2.5 } }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1.5,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            Dernières étapes
                                        </Typography>
                                        <Chip
                                            label="Voir l’itinéraire"
                                            size="small"
                                            onClick={() => setCurrentTab(1)}
                                            sx={{
                                                cursor: 'pointer',
                                                bgcolor: 'background.default',
                                                borderRadius: 999,
                                            }}
                                        />
                                    </Box>

                                    <Stack divider={<Divider flexItem />}>
                                        {latestEntries.map((entry) => (
                                            <Box
                                                key={entry.id}
                                                sx={{
                                                    py: 1.25,
                                                    display: 'flex',
                                                    gap: 1.5,
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        {entry.location ||
                                                            new Date(
                                                                entry.entry_date
                                                            ).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                            })}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {entry.content}
                                                    </Typography>
                                                </Box>

                                                {entry.media_assets &&
                                                    entry.media_assets.length > 0 && (
                                                        <Chip
                                                            label={`${entry.media_assets.length} média${
                                                                entry.media_assets.length > 1
                                                                    ? 's'
                                                                    : ''
                                                            }`}
                                                            size="small"
                                                            sx={{
                                                                alignSelf: 'center',
                                                                borderRadius: 999,
                                                            }}
                                                        />
                                                    )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </TabPanel>

                {/* Itinéraire */}
                <TabPanel value={currentTab} index={1}>
                    <JournalMapView
                        entries={journalEntries}
                        media={media}
                        tripLat={trip.lat}
                        tripLng={trip.lng}
                    />
                </TabPanel>

                {/* Médias */}
                <TabPanel value={currentTab} index={2}>
                    <MediaGallery media={media} tripId={trip.id} />
                </TabPanel>

                {/* Dépenses */}
                <TabPanel value={currentTab} index={3}>
                    <ExpenseList
                        expenses={expenses}
                        tripId={trip.id}
                        onRefresh={onRefresh}
                    />
                </TabPanel>
            </Box>
        </Box>
    );
}
