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
} from '@mui/material';
import {
    Luggage as LuggageIcon,
    Book as BookIcon,
    Receipt as ReceiptIcon,
    AutoAwesome as AutoAwesomeIcon,
    Map as MapIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';

interface QuickActionCard {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
}

const QUICK_ACTIONS: QuickActionCard[] = [
    {
        title: 'Mes Voyages',
        description: 'Voir et gérer tous vos voyages',
        href: '/trips',
        icon: <LuggageIcon sx={{ fontSize: 32 }} />,
        color: '#0F766E',
    },
    {
        title: 'Journal',
        description: 'Écrire dans votre journal de voyage',
        href: '/journal',
        icon: <BookIcon sx={{ fontSize: 32 }} />,
        color: '#3B82F6',
    },
    {
        title: 'Dépenses',
        description: 'Suivre vos dépenses de voyage',
        href: '/expenses',
        icon: <ReceiptIcon sx={{ fontSize: 32 }} />,
        color: '#F59E0B',
    },
    {
        title: 'Stories',
        description: 'Créer des stories avec l\'IA',
        href: '/stories',
        icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
        color: '#8B5CF6',
    },
    {
        title: 'Carte',
        description: 'Explorer vos voyages sur la carte',
        href: '/map',
        icon: <MapIcon sx={{ fontSize: 32 }} />,
        color: '#10B981',
    },
];

async function getDashboardStats() {
    const supabase = await createClient();

    // Get trips count
    const { count: tripsCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true });

    // Get journal entries count
    const { count: journalCount } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true });

    // Get media count
    const { count: mediaCount } = await supabase
        .from('media_assets')
        .select('*', { count: 'exact', head: true });

    // Get total expenses
    const { data: expensesData } = await supabase
        .from('expenses')
        .select('amount');

    const totalExpenses = expensesData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    // Get countries visited
    const { data: countriesData } = await supabase
        .from('trips')
        .select('country');

    const countriesSet = new Set(countriesData?.map((t) => t.country) || []);

    return {
        trips: tripsCount || 0,
        journal_entries: journalCount || 0,
        media: mediaCount || 0,
        total_expenses: totalExpenses,
        countries: countriesSet.size,
    };
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
}) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        mb: 1.5,
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
}

function StatsLoading() {
    return (
        <Grid container spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 6, sm: 4, md: 2.4 }}>
                    <Skeleton variant="rounded" height={140} />
                </Grid>
            ))}
        </Grid>
    );
}

async function DashboardStats() {
    const stats = await getDashboardStats();

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                <StatCard
                    label="Voyages"
                    value={stats.trips}
                    icon={<LuggageIcon />}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                <StatCard
                    label="Pays visités"
                    value={stats.countries}
                    icon={<MapIcon />}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                <StatCard
                    label="Entrées journal"
                    value={stats.journal_entries}
                    icon={<BookIcon />}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                <StatCard
                    label="Photos & Vidéos"
                    value={stats.media}
                    icon={<TrendingUpIcon />}
                />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                <StatCard
                    label="Total dépenses"
                    value={`${stats.total_expenses.toLocaleString('fr-FR')} €`}
                    icon={<ReceiptIcon />}
                />
            </Grid>
        </Grid>
    );
}

export default function HomePage() {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                    color: 'white',
                    py: { xs: 4, md: 6 },
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{ fontWeight: 700, mb: 1 }}
                    >
                        Travel Story Maker ✈️
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                        Capturez vos aventures, créez des souvenirs inoubliables
                    </Typography>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Stats Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        Vue d'ensemble
                    </Typography>
                    <Suspense fallback={<StatsLoading />}>
                        <DashboardStats />
                    </Suspense>
                </Box>

                {/* Quick Actions */}
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        Accès rapide
                    </Typography>
                    <Grid container spacing={2}>
                        {QUICK_ACTIONS.map((action) => (
                            <Grid key={action.href} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardActionArea
                                        // component={Link}
                                        href={action.href}
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box
                                                sx={{
                                                    display: 'inline-flex',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: `${action.color}15`,
                                                    color: action.color,
                                                    mb: 2,
                                                }}
                                            >
                                                {action.icon}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600, mb: 0.5 }}
                                            >
                                                {action.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
