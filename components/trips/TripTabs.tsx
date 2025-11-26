'use client';

import { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Book as BookIcon,
    Photo as PhotoIcon,
    Receipt as ReceiptIcon,
    AutoAwesome as StoriesIcon,
} from '@mui/icons-material';
import JournalList from '@/components/journal/JournalList';
import MediaGallery from '@/components/media/MediaGallery';
import ExpenseList from '@/components/expenses/ExpenseList';
// import StoryList from '@/components/stories/StoryList';
import { formatCurrency, getDurationDays } from '@/lib/utils/formatters';
import { TRIP_MOODS } from '@/types/trip';
import type { Trip, JournalEntryWithMedia, MediaAsset, Expense, Story } from '@/types';

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
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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
    const [currentTab, setCurrentTab] = useState(0);

    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);
    const durationDays = getDurationDays(trip.start_date, trip.end_date);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Box>
            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab
                            icon={<DashboardIcon />}
                            iconPosition="start"
                            label="Vue d'ensemble"
                        />
                        <Tab
                            icon={<BookIcon />}
                            iconPosition="start"
                            label={`Journal (${stats.journalCount})`}
                        />
                        <Tab
                            icon={<PhotoIcon />}
                            iconPosition="start"
                            label={`Médias (${stats.photosCount + stats.videosCount})`}
                        />
                        <Tab
                            icon={<ReceiptIcon />}
                            iconPosition="start"
                            label={`Dépenses (${formatCurrency(stats.totalExpenses)})`}
                        />
                        <Tab
                            icon={<StoriesIcon />}
                            iconPosition="start"
                            label={`Stories (${stats.storiesCount})`}
                        />
                    </Tabs>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Overview Tab */}
                <TabPanel value={currentTab} index={0}>
                    <Grid container spacing={3}>
                        {/* Stats Cards */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {durationDays}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                jours
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stats.journalCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                entrées journal
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stats.photosCount + stats.videosCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                médias
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {formatCurrency(stats.totalExpenses)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                dépensés
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Description */}
                            {trip.description && (
                                <Card sx={{ mt: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            À propos de ce voyage
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {trip.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>

                        {/* Sidebar */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Informations
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Destination
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {trip.country}
                                                {trip.city && `, ${trip.city}`}
                                            </Typography>
                                        </Box>

                                        {moodData && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Humeur
                                                </Typography>
                                                <Chip
                                                    label={`${moodData.emoji} ${moodData.label}`}
                                                    size="small"
                                                    sx={{ mt: 0.5 }}
                                                />
                                            </Box>
                                        )}

                                        {trip.lat && trip.lng && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Position
                                                </Typography>
                                                <Typography variant="body1">
                                                    {trip.lat.toFixed(4)}, {trip.lng.toFixed(4)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Mini map placeholder */}
                            {trip.lat && trip.lng && (
                                <Card sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            height: 200,
                                            bgcolor: 'grey.200',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography color="text.secondary">
                                            Carte (à implémenter)
                                        </Typography>
                                    </Box>
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Journal Tab */}
                <TabPanel value={currentTab} index={1}>
                    <JournalList entries={journalEntries} tripId={trip.id} onRefresh={onRefresh} />
                </TabPanel>

                {/* Media Tab */}
                <TabPanel value={currentTab} index={2}>
                    <MediaGallery media={media} tripId={trip.id} />
                </TabPanel>

                {/* Expenses Tab */}
                <TabPanel value={currentTab} index={3}>
                    <ExpenseList expenses={expenses} tripId={trip.id} />
                </TabPanel>

                {/* Stories Tab */}
                {/* <TabPanel value={currentTab} index={4}>
                    <StoryList stories={stories} tripId={trip.id} />
                </TabPanel> */}
            </Container>
        </Box>
    );
}
