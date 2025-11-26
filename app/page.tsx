import { Suspense } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Skeleton,
    Button,
} from '@mui/material';
import {
    Luggage as LuggageIcon,
    Book as BookIcon,
    PhotoCamera as PhotoIcon,
    Map as MapIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/formatters';

async function getRecentTrips() {
    const supabase = await createClient();

    const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(4);

    // Get stats for each trip
    const tripsWithStats = await Promise.all(
        (trips || []).map(async (trip) => {
            const { count: entriesCount } = await supabase
                .from('journal_entries')
                .select('*', { count: 'exact', head: true })
                .eq('trip_id', trip.id);

            const { count: photosCount } = await supabase
                .from('media_assets')
                .select('*', { count: 'exact', head: true })
                .eq('trip_id', trip.id)
                .eq('media_type', 'photo');

            return {
                ...trip,
                entries_count: entriesCount || 0,
                photos_count: photosCount || 0,
            };
        })
    );

    return tripsWithStats;
}

async function getDashboardStats() {
    const supabase = await createClient();

    const { count: tripsCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true });

    const { count: journalCount } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true });

    const { count: photosCount } = await supabase
        .from('media_assets')
        .select('*', { count: 'exact', head: true })
        .eq('media_type', 'photo');

    const { data: countriesData } = await supabase
        .from('trips')
        .select('country');

    const countriesSet = new Set(countriesData?.map((t) => t.country) || []);

    return {
        trips: tripsCount || 0,
        journal_entries: journalCount || 0,
        photos: photosCount || 0,
        countries: countriesSet.size,
    };
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                {icon}
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>{label}</Typography>
        </Box>
    );
}

function TripsLoading() {
    return (
        <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rounded" height={140} />
                </Grid>
            ))}
        </Grid>
    );
}

async function RecentTrips() {
    const trips = await getRecentTrips();

    if (trips.length === 0) {
        return (
            <Card sx={{ textAlign: 'center', py: 6, bgcolor: 'grey.50' }}>
                <CardContent>
                    <LuggageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        Aucun voyage pour le moment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Commencez par créer votre premier voyage !
                    </Typography>
                    <Button
                        component={Link}
                        href="/trips?new=true"
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Créer mon premier voyage
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Grid container spacing={2}>
            {trips.map((trip) => (
                <Grid key={trip.id} size={{ xs: 12, sm: 6 }}>
                    <Card
                        sx={{
                            height: '100%',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                        }}
                    >
                        <CardActionArea component={Link} href={`/trips/${trip.id}`} sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {trip.country}
                                </Typography>
                                {trip.city && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {trip.city}
                                    </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                                    {formatDate(trip.start_date)}
                                    {trip.end_date && ` → ${formatDate(trip.end_date)}`}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <BookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {trip.entries_count} entrées
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <PhotoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {trip.photos_count} photos
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

async function DashboardHeader() {
    const stats = await getDashboardStats();

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                color: 'white',
                py: { xs: 4, md: 5 },
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Mon Journal de Voyage ✈️
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                    Documentez vos aventures, jour après jour
                </Typography>

                <Box sx={{ display: 'flex', gap: { xs: 3, sm: 5 }, flexWrap: 'wrap' }}>
                    <StatBadge icon={<LuggageIcon sx={{ fontSize: 20 }} />} value={stats.trips} label="voyages" />
                    <StatBadge icon={<MapIcon sx={{ fontSize: 20 }} />} value={stats.countries} label="pays" />
                    <StatBadge icon={<BookIcon sx={{ fontSize: 20 }} />} value={stats.journal_entries} label="entrées" />
                    <StatBadge icon={<PhotoIcon sx={{ fontSize: 20 }} />} value={stats.photos} label="photos" />
                </Box>
            </Container>
        </Box>
    );
}

export default function HomePage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Suspense
                fallback={
                    <Box sx={{ background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)', py: 5, px: 3 }}>
                        <Container maxWidth="lg">
                            <Skeleton variant="text" width={300} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                            <Skeleton variant="text" width={250} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />
                            <Box sx={{ display: 'flex', gap: 5 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} variant="rounded" width={60} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                ))}
                            </Box>
                        </Container>
                    </Box>
                }
            >
                <DashboardHeader />
            </Suspense>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Mes Voyages
                    </Typography>
                    <Button
                        component={Link}
                        href="/trips"
                        variant="text"
                        size="small"
                    >
                        Voir tout
                    </Button>
                </Box>

                <Suspense fallback={<TripsLoading />}>
                    <RecentTrips />
                </Suspense>

                {/* How it works */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Comment ça marche ?
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            { step: '1', title: 'Créez un voyage', desc: 'Ajoutez un nouveau voyage avec pays, dates...' },
                            { step: '2', title: 'Ajoutez des entrées', desc: 'Documentez chaque jour avec photos et texte' },
                            { step: '3', title: 'Photos = auto-remplissage', desc: 'Les métadonnées EXIF pré-remplissent la date et le lieu' },
                        ].map((item) => (
                            <Grid key={item.step} size={{ xs: 12, md: 4 }}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                mb: 1.5,
                                            }}
                                        >
                                            {item.step}
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
