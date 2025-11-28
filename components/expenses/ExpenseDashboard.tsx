'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Tabs,
    Tab,
    Chip,
    Stack,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Paper,
    Pagination,
} from '@mui/material';
import {
    Receipt as ReceiptIcon,
    TrendingUp as TrendingIcon,
    CalendarMonth as CalendarIcon,
    Search as SearchIcon,
    ViewList as ListIcon,
    GridView as GridIcon,
    FilterList as FilterIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon,
    Restaurant as FoodIcon,
    DirectionsCar as TransportIcon,
    Hotel as HotelIcon,
    Attractions as ActivityIcon,
    ShoppingBag as ShoppingIcon,
    MoreHoriz as OtherIcon,
    NightlifeOutlined as SortiesIcon,
    LocalLaundryService as BlanchisserieIcon,
    Wifi as InternetIcon,
    AccountBalance as BanqueIcon,
    Backpack as EquipementIcon,
    LocalHospital as SanteIcon,
    Category as GeneralIcon,
} from '@mui/icons-material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
    AreaChart,
    Area,
} from 'recharts';
import { tokens, flexBetween, categoryColors } from '@/styles';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import ExpenseTable from './ExpenseTable';
import type { Expense } from '@/types';

interface ExpenseDashboardProps {
    expenses: Expense[];
    tripId?: string;
    onRefresh?: () => void;
    onAddExpense?: () => void;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    logement: <HotelIcon />,
    transport: <TransportIcon />,
    food: <FoodIcon />,
    activite: <ActivityIcon />,
    sorties: <SortiesIcon />,
    shopping: <ShoppingIcon />,
    blanchisserie: <BlanchisserieIcon />,
    internet: <InternetIcon />,
    banque: <BanqueIcon />,
    equipement: <EquipementIcon />,
    sante: <SanteIcon />,
    general: <GeneralIcon />,
    autre: <OtherIcon />,
};

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
    logement: 'Logement',
    transport: 'Transport',
    food: 'Restauration',
    activite: 'Activités',
    sorties: 'Sorties',
    shopping: 'Shopping',
    blanchisserie: 'Blanchisserie',
    internet: 'Internet & Tel',
    banque: 'Frais bancaires',
    equipement: 'Équipement',
    sante: 'Santé',
    general: 'Général',
    autre: 'Autre',
};

// Items per page
const ITEMS_PER_PAGE = 12;

// Stat card component
function StatCard({
    title,
    value,
    subtitle,
    icon,
    color = 'primary.main',
    trend,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
    trend?: { value: number; isUp: boolean };
}) {
    return (
        <Card>
            <CardContent sx={{ pb: '16px !important' }}>
                <Box sx={{ ...flexBetween, mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 40, height: 40 }}>
                        {icon}
                    </Avatar>
                    {trend && (
                        <Chip
                            size="small"
                            icon={trend.isUp ? <ArrowUpIcon sx={{ fontSize: 14 }} /> : <ArrowDownIcon sx={{ fontSize: 14 }} />}
                            label={`${trend.value}%`}
                            sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                bgcolor: trend.isUp ? '#FEE2E2' : '#D1FAE5',
                                color: trend.isUp ? '#DC2626' : '#059669',
                                '& .MuiChip-icon': { color: 'inherit' },
                            }}
                        />
                    )}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: tokens.fontWeights.bold, mb: 0.25 }}>
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

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    return (
        <Paper sx={{ p: 1.5, boxShadow: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            {payload.map((entry: any, index: number) => (
                <Typography key={index} variant="body2" sx={{ fontWeight: tokens.fontWeights.semibold, color: entry.color }}>
                    {formatCurrency(entry.value)}
                </Typography>
            ))}
        </Paper>
    );
}

export default function ExpenseDashboard({
    expenses,
    tripId,
    onRefresh,
    onAddExpense,
}: ExpenseDashboardProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filters change
    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Calculate stats and data
    const {
        totalAmount,
        avgPerDay,
        byCategory,
        byDate,
        expenseCount,
        topCategory,
        filteredExpenses,
        paginatedExpenses,
        totalPages,
    } = useMemo(() => {
        // Filter expenses
        let filtered = [...expenses];

        if (categoryFilter !== 'all') {
            filtered = filtered.filter((e) => e.category === categoryFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.label?.toLowerCase().includes(query) ||
                    e.category.toLowerCase().includes(query) ||
                    CATEGORY_LABELS[e.category]?.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime();
            }
            return b.amount - a.amount;
        });

        // Total
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);

        // By category
        const catMap: Record<string, number> = {};
        expenses.forEach((e) => {
            catMap[e.category] = (catMap[e.category] || 0) + e.amount;
        });
        const categoryData = Object.entries(catMap)
            .map(([category, amount]) => ({
                category,
                label: CATEGORY_LABELS[category] || category,
                amount,
                percentage: total > 0 ? (amount / total) * 100 : 0,
                color: categoryColors[category] || '#6B7280',
            }))
            .sort((a, b) => b.amount - a.amount);

        // By date (for trend chart)
        const dateMap: Record<string, number> = {};
        expenses.forEach((e) => {
            const date = formatDate(e.expense_date, 'dd/MM');
            dateMap[date] = (dateMap[date] || 0) + e.amount;
        });
        const dateData = Object.entries(dateMap)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => {
                const [dayA, monthA] = a.date.split('/').map(Number);
                const [dayB, monthB] = b.date.split('/').map(Number);
                return monthA !== monthB ? monthA - monthB : dayA - dayB;
            });

        // Calculate days
        const dates = expenses.map((e) => new Date(e.expense_date).getTime());
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);
        const days = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1);
        const avgDay = total / days;

        // Top category
        const top = categoryData[0];

        // Pagination
        const pages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return {
            totalAmount: total,
            avgPerDay: avgDay,
            byCategory: categoryData,
            byDate: dateData,
            expenseCount: expenses.length,
            topCategory: top,
            filteredExpenses: filtered,
            paginatedExpenses: paginated,
            totalPages: pages,
        };
    }, [expenses, categoryFilter, searchQuery, sortBy, currentPage]);

    // Empty state
    if (expenses.length === 0) {
        return (
            <Card sx={{ textAlign: 'center', py: 8 }}>
                <ReceiptIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: tokens.fontWeights.semibold }}>
                    Aucune dépense enregistrée
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Commencez à suivre vos dépenses pour voir les statistiques
                </Typography>
                {onAddExpense && (
                    <Chip
                        label="Ajouter une dépense"
                        onClick={onAddExpense}
                        color="primary"
                        sx={{ fontWeight: tokens.fontWeights.medium }}
                    />
                )}
            </Card>
        );
    }

    return (
        <Box>
            {/* ============================================================ */}
            {/* STATS ROW */}
            {/* ============================================================ */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                        title="Total dépensé"
                        value={formatCurrency(totalAmount)}
                        subtitle={`${expenseCount} transactions`}
                        icon={<ReceiptIcon />}
                        color="#FACC15"
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                        title="Moyenne / jour"
                        value={formatCurrency(avgPerDay)}
                        icon={<CalendarIcon />}
                        color="#3B82F6"
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                        title="Top catégorie"
                        value={topCategory?.label || '-'}
                        subtitle={topCategory ? formatCurrency(topCategory.amount) : undefined}
                        icon={CATEGORY_ICONS[topCategory?.category || 'other']}
                        color={topCategory?.color || '#6B7280'}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                        title="Transactions"
                        value={expenseCount.toString()}
                        subtitle={`${byCategory.length} catégories`}
                        icon={<TrendingIcon />}
                        color="#10B981"
                    />
                </Grid>
            </Grid>

            {/* ============================================================ */}
            {/* CHARTS ROW */}
            {/* ============================================================ */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Pie chart - By category */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold, mb: 2 }}>
                                Répartition par catégorie
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* Pie */}
                                <Box sx={{ width: 160, height: 160 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={byCategory}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="amount"
                                            >
                                                {byCategory.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>

                                {/* Legend */}
                                <Stack spacing={1} sx={{ flex: 1 }}>
                                    {byCategory.slice(0, 5).map((cat) => (
                                        <Box key={cat.category} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    bgcolor: cat.color,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ flex: 1 }}>
                                                {cat.label}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: tokens.fontWeights.semibold }}>
                                                {cat.percentage.toFixed(0)}%
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Area chart - By date */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold, mb: 2 }}>
                                Évolution des dépenses
                            </Typography>

                            <Box sx={{ height: 180 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={byDate}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: '#6B7280' }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#E5E7EB' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: '#6B7280' }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `${v}€`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#FACC15"
                                            strokeWidth={2}
                                            fill="url(#colorAmount)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ============================================================ */}
            {/* CATEGORY BREAKDOWN */}
            {/* ============================================================ */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold, mb: 2 }}>
                        Détail par catégorie
                    </Typography>

                    <Stack spacing={2}>
                        {byCategory.map((cat) => (
                            <Box key={cat.category}>
                                <Box sx={{ ...flexBetween, mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: `${cat.color}15`, color: cat.color }}>
                                            {CATEGORY_ICONS[cat.category]}
                                        </Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.medium }}>
                                            {cat.label}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                        {formatCurrency(cat.amount)}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={cat.percentage}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'action.hover',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: cat.color,
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            {/* ============================================================ */}
            {/* FILTERS & TABLE */}
            {/* ============================================================ */}
            <Card>
                <CardContent>
                    {/* Filters row */}
                    <Box sx={{ ...flexBetween, mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold }}>
                            Transactions
                        </Typography>

                        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            {/* Search */}
                            <TextField
                                size="small"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: 180 }}
                            />

                            {/* Category filter */}
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <Select
                                    value={categoryFilter}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="all">Toutes catégories</MenuItem>
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                        <MenuItem key={key} value={key}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: categoryColors[key],
                                                    }}
                                                />
                                                {label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Sort */}
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                                >
                                    <MenuItem value="date">Par date</MenuItem>
                                    <MenuItem value="amount">Par montant</MenuItem>
                                </Select>
                            </FormControl>

                            {/* View toggle */}
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(_, v) => v && setViewMode(v)}
                                size="small"
                            >
                                <ToggleButton value="grid">
                                    <GridIcon sx={{ fontSize: 18 }} />
                                </ToggleButton>
                                <ToggleButton value="list">
                                    <ListIcon sx={{ fontSize: 18 }} />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                    </Box>

                    {/* Results count */}
                    <Box sx={{ ...flexBetween, mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            {filteredExpenses.length} résultat{filteredExpenses.length > 1 ? 's' : ''}
                            {categoryFilter !== 'all' && ` dans "${CATEGORY_LABELS[categoryFilter]}"`}
                        </Typography>
                        {totalPages > 1 && (
                            <Typography variant="caption" color="text.secondary">
                                Page {currentPage} sur {totalPages}
                            </Typography>
                        )}
                    </Box>

                    {/* Expense list/grid */}
                    {viewMode === 'list' ? (
                        <ExpenseTable expenses={paginatedExpenses} />
                    ) : (
                        <Grid container spacing={2}>
                            {paginatedExpenses.map((expense) => (
                                <Grid key={expense.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            '&:hover': { borderColor: 'primary.main' },
                                            transition: tokens.transitions.fast,
                                        }}
                                    >
                                        <CardContent sx={{ pb: '12px !important' }}>
                                            <Box sx={{ ...flexBetween, mb: 1 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        bgcolor: categoryColors[expense.category] || '#E5E7EB',
                                                        color: '#FFFFFF',
                                                    }}
                                                >
                                                    {CATEGORY_ICONS[expense.category] || <OtherIcon />}
                                                </Avatar>
                                                <Chip
                                                    label={CATEGORY_LABELS[expense.category] || expense.category}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.65rem',
                                                        bgcolor: `${categoryColors[expense.category] || '#E5E7EB'}30`,
                                                        color: 'text.primary',
                                                    }}
                                                />
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: tokens.fontWeights.bold, mb: 0.25 }}
                                            >
                                                {formatCurrency(expense.amount)}
                                            </Typography>
                                            {expense.label && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {expense.label}
                                                </Typography>
                                            )}
                                            <Typography variant="caption" color="text.disabled">
                                                {formatDate(expense.expense_date, 'dd MMM yyyy')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, page) => setCurrentPage(page)}
                                color="primary"
                                shape="rounded"
                                showFirstButton
                                showLastButton
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontWeight: tokens.fontWeights.medium,
                                    },
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
