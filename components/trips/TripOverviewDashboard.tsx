'use client';

import { useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Stack,
    Chip,
    Avatar,
    IconButton,
    LinearProgress,
} from '@mui/material';
import {
    PhotoCamera as PhotoIcon,
    Videocam as VideoIcon,
    Receipt as ExpenseIcon,
    Map as MapIcon,
    TrendingUp as TrendingIcon,
    CalendarMonth as CalendarIcon,
    LocationOn as LocationIcon,
    ArrowForward as ArrowIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { tokens, flexBetween, textTruncate } from '@/styles';
import { formatDateLong, formatCurrency } from '@/lib/utils/formatters';
import { JOURNAL_MOODS } from '@/types/journal';
import { categoryColors } from '@/styles';
import type { Trip, JournalEntryWithMedia, MediaAsset, Expense, TripStats } from '@/types';

// Dynamic map import
const TripMapView = dynamic(() => import('./TripMapView'), {
    ssr: false,
    loading: () => (
        <Box sx={{ height: '100%', bgcolor: 'action.hover', borderRadius: 2 }} />
    ),
});

interface TripOverviewDashboardProps {
    trip: Trip;
    entries: JournalEntryWithMedia[];
    media: MediaAsset[];
    expenses: Expense[];
    stats: TripStats;
    onOpenJournal: () => void;
    onOpenExpense: () => void;
    onNavigateToTab: (tab: string) => void;
}

// Stat card component
function StatCard({
    title,
    value,
    subtitle,
    icon,
    color = 'primary.main',
    onClick,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
    onClick?: () => void;
}) {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                transition: tokens.transitions.fast,
                '&:hover': onClick ? { borderColor: 'primary.main' } : undefined,
            }}
        >
            <CardContent>
                <Box sx={{ ...flexBetween, mb: 2 }}>
                    <Avatar sx={{ bgcolor: color, width: 44, height: 44 }}>
                        {icon}
                    </Avatar>
                    {onClick && (
                        <IconButton size="small">
                            <ArrowIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: tokens.fontWeights.bold }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" color="text.disabled">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

// Recent entry card
function RecentEntryCard({ entry }: { entry: JournalEntryWithMedia }) {
    const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
    const photo = entry.media_assets?.find((m) => m.media_type === 'photo');

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.subtle',
                '&:hover': { bgcolor: 'action.hover' },
                cursor: 'pointer',
            }}
        >
            {photo ? (
                <Avatar
                    src={photo.thumbnail_url || photo.url}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                />
            ) : (
                <Avatar
                    variant="rounded"
                    sx={{ width: 56, height: 56, bgcolor: moodData?.color || 'primary.main' }}
                >
                    {moodData?.emoji || '📍'}
                </Avatar>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ ...flexBetween }}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: tokens.fontWeights.medium, color: 'text.secondary' }}
                    >
                        {formatDateLong(entry.entry_date)}
                    </Typography>
                    {moodData && <Typography sx={{ fontSize: 16 }}>{moodData.emoji}</Typography>}
                </Box>
                {entry.location && (
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: tokens.fontWeights.semibold, ...textTruncate(1) }}
                    >
                        {entry.location}
                    </Typography>
                )}
                {entry.content && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ...textTruncate(2) }}
                    >
                        {entry.content}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

// Expense by category
function ExpenseBreakdown({ expenses }: { expenses: Expense[] }) {
    const breakdown = useMemo(() => {
        const byCategory: Record<string, number> = {};
        let total = 0;
        expenses.forEach((e) => {
            byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
            total += e.amount;
        });
        return { byCategory, total };
    }, [expenses]);

    const sorted = Object.entries(breakdown.byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    if (expenses.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">Aucune dépense</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={2}>
            {sorted.map(([category, amount]) => {
                const percentage = (amount / breakdown.total) * 100;
                return (
                    <Box key={category}>
                        <Box sx={{ ...flexBetween, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {category}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.semibold }}>
                                {formatCurrency(amount)}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: categoryColors[category] || 'primary.main',
                                    borderRadius: 3,
                                },
                            }}
                        />
                    </Box>
                );
            })}
        </Stack>
    );
}

export default function TripOverviewDashboard({
    trip,
    entries,
    media,
    expenses,
    stats,
    onOpenJournal,
    onOpenExpense,
    onNavigateToTab,
}: TripOverviewDashboardProps) {
    // Sort entries by date (most recent first)
    const recentEntries = useMemo(
        () =>
            [...entries]
                .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
                .slice(0, 4),
        [entries]
    );

    // Entries with coordinates for map
    const entriesWithCoords = useMemo(
        () => entries.filter((e) => e.lat && e.lng),
        [entries]
    );

    // Recent photos
    const recentPhotos = useMemo(
        () =>
            media
                .filter((m) => m.media_type === 'photo')
                .slice(0, 6),
        [media]
    );

    return (
        <Grid container spacing={3}>
            {/* ============================================================ */}
            {/* TOP ROW - Stats cards */}
            {/* ============================================================ */}
            <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                    title="Étapes"
                    value={entries.length}
                    subtitle={`${entriesWithCoords.length} avec GPS`}
                    icon={<LocationIcon />}
                    color="#22C55E"
                    onClick={() => onNavigateToTab('itinerary')}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                    title="Photos"
                    value={stats.photosCount}
                    icon={<PhotoIcon />}
                    color="#3B82F6"
                    onClick={() => onNavigateToTab('media')}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                    title="Vidéos"
                    value={stats.videosCount}
                    icon={<VideoIcon />}
                    color="#8B5CF6"
                    onClick={() => onNavigateToTab('media')}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                    title="Dépenses"
                    value={formatCurrency(stats.totalExpenses)}
                    subtitle={`${expenses.length} transactions`}
                    icon={<ExpenseIcon />}
                    color="#F59E0B"
                    onClick={() => onNavigateToTab('expenses')}
                />
            </Grid>

            {/* ============================================================ */}
            {/* MIDDLE ROW - Map + Recent entries */}
            {/* ============================================================ */}

            {/* Map card - 2/3 width */}
            <Grid size={{ xs: 12, lg: 8 }}>
                <Card sx={{ height: 400, overflow: 'hidden' }}>
                    <Box sx={{ ...flexBetween, p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapIcon color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                Itinéraire
                            </Typography>
                            <Chip
                                label={`${entriesWithCoords.length} lieux`}
                                size="small"
                                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                            />
                        </Box>
                        <IconButton size="small" onClick={() => onNavigateToTab('itinerary')}>
                            <ArrowIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 'calc(100% - 57px)' }}>
                        <TripMapView
                            entries={entriesWithCoords}
                            media={media}
                            tripLat={trip.lat}
                            tripLng={trip.lng}
                        />
                    </Box>
                </Card>
            </Grid>

            {/* Recent entries - 1/3 width */}
            <Grid size={{ xs: 12, lg: 4 }}>
                <Card sx={{ height: 400 }}>
                    <Box sx={{ ...flexBetween, p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold }}>
                            Dernières étapes
                        </Typography>
                        <IconButton size="small" color="primary" onClick={onOpenJournal}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 2, height: 'calc(100% - 57px)', overflow: 'auto' }}>
                        {recentEntries.length > 0 ? (
                            <Stack spacing={1.5}>
                                {recentEntries.map((entry) => (
                                    <RecentEntryCard key={entry.id} entry={entry} />
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CalendarIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                <Typography color="text.secondary">Aucune étape</Typography>
                                <Chip
                                    label="Ajouter une étape"
                                    icon={<AddIcon />}
                                    onClick={onOpenJournal}
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        )}
                    </Box>
                </Card>
            </Grid>

            {/* ============================================================ */}
            {/* BOTTOM ROW - Photos + Expenses */}
            {/* ============================================================ */}

            {/* Recent photos */}
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
                <Card>
                    <Box sx={{ ...flexBetween, p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhotoIcon color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                Photos récentes
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => onNavigateToTab('media')}>
                            <ArrowIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {recentPhotos.length > 0 ? (
                            <Grid container spacing={1}>
                                {recentPhotos.map((photo) => (
                                    <Grid key={photo.id} size={{ xs: 4 }}>
                                        <Box
                                            component="img"
                                            src={photo.thumbnail_url || photo.url}
                                            alt=""
                                            sx={{
                                                width: '100%',
                                                aspectRatio: '1',
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <PhotoIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                <Typography color="text.secondary">Aucune photo</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Grid>

            {/* Expenses breakdown */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Card>
                    <Box sx={{ ...flexBetween, p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingIcon color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                Répartition dépenses
                            </Typography>
                        </Box>
                        <IconButton size="small" color="primary" onClick={onOpenExpense}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <ExpenseBreakdown expenses={expenses} />
                    </Box>
                </Card>
            </Grid>

            {/* Quick actions / Tips */}
            <Grid size={{ xs: 12, lg: 3 }}>
                <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold, mb: 2 }}>
                            Actions rapides
                        </Typography>
                        <Stack spacing={1.5}>
                            <Chip
                                icon={<AddIcon sx={{ color: 'inherit !important' }} />}
                                label="Nouvelle étape"
                                onClick={onOpenJournal}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                    color: 'primary.contrastText',
                                    justifyContent: 'flex-start',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.25)' },
                                }}
                            />
                            <Chip
                                icon={<ExpenseIcon sx={{ color: 'inherit !important' }} />}
                                label="Ajouter dépense"
                                onClick={onOpenExpense}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                    color: 'primary.contrastText',
                                    justifyContent: 'flex-start',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.25)' },
                                }}
                            />
                            <Chip
                                icon={<MapIcon sx={{ color: 'inherit !important' }} />}
                                label="Voir l'itinéraire"
                                onClick={() => onNavigateToTab('itinerary')}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                    color: 'primary.contrastText',
                                    justifyContent: 'flex-start',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.25)' },
                                }}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
