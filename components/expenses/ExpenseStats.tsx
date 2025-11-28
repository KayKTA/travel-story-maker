'use client';

import { useMemo } from 'react';
import { Box, Card, CardContent, Grid, Typography, LinearProgress } from '@mui/material';
import { formatCurrency } from '@/lib/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/types/expense';
import { tokens, flexBetween, flexStart } from '@/styles';
import type { ExpenseStats as ExpenseStatsType } from '@/types';

interface ExpenseStatsProps {
    stats: ExpenseStatsType;
}

// Get category info helper
const getCategoryInfo = (category: string) => {
    return (
        EXPENSE_CATEGORIES.find((c) => c.value === category) || {
            label: category,
            emoji: '📦',
            color: '#6B7280',
        }
    );
};

export default function ExpenseStats({ stats }: ExpenseStatsProps) {
    // Sort categories by amount
    const sortedCategories = useMemo(
        () => [...stats.by_category].sort((a, b) => b.total_amount - a.total_amount),
        [stats.by_category]
    );

    return (
        <Card>
            <CardContent>
                <Grid container spacing={3}>
                    {/* Total */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'action.hover',
                                borderRadius: tokens.radius.md,
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: tokens.fontWeights.bold, color: 'primary.main' }}
                            >
                                {formatCurrency(stats.total, stats.currency)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total des dépenses ({stats.count} transactions)
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Breakdown by category */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}
                        >
                            Répartition par catégorie
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {sortedCategories.map((cat) => {
                                const categoryInfo = getCategoryInfo(cat.category);
                                const percentage =
                                    stats.total > 0
                                        ? Math.round((cat.total_amount / stats.total) * 100)
                                        : 0;

                                return (
                                    <Box key={cat.category}>
                                        <Box sx={{ ...flexBetween, mb: 0.5 }}>
                                            <Box sx={{ ...flexStart, gap: 1 }}>
                                                <span>{categoryInfo.emoji}</span>
                                                <Typography variant="body2">{categoryInfo.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ({cat.count})
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: tokens.fontWeights.medium }}
                                            >
                                                {formatCurrency(cat.total_amount, cat.currency)}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={percentage}
                                            sx={{
                                                height: 8,
                                                borderRadius: tokens.radius.sm,
                                                bgcolor: `${categoryInfo.color}20`,
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: categoryInfo.color,
                                                    borderRadius: tokens.radius.sm,
                                                },
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
