'use client';

import { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import ExpenseTable from './ExpenseTable';
import ExpenseStats from './ExpenseStats';
import { tokens } from '@/styles';
import type { Expense, ExpensesByCategory } from '@/types';

interface ExpenseListProps {
    expenses: Expense[];
    tripId?: string;
    onRefresh?: () => void;
}

export default function ExpenseList({ expenses, tripId, onRefresh }: ExpenseListProps) {
    // Calculate stats with memoization
    const stats = useMemo(() => {
        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

        const byCategory: Record<string, { amount: number; count: number }> = {};
        expenses.forEach((e) => {
            if (!byCategory[e.category]) {
                byCategory[e.category] = { amount: 0, count: 0 };
            }
            byCategory[e.category].amount += e.amount;
            byCategory[e.category].count += 1;
        });

        const categoriesStats: ExpensesByCategory[] = Object.entries(byCategory).map(
            ([category, data]) => ({
                category: category as ExpensesByCategory['category'],
                total_amount: data.amount,
                count: data.count,
                currency: 'EUR',
            })
        );

        return {
            total: totalAmount,
            currency: 'EUR',
            by_category: categoriesStats,
            count: expenses.length,
        };
    }, [expenses]);

    // Empty state
    if (expenses.length === 0) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'action.hover',
                    borderRadius: tokens.radius.md,
                }}
            >
                <ReceiptIcon
                    sx={{
                        fontSize: tokens.iconSizes.xl * 1.5,
                        color: 'action.disabled',
                        mb: 2,
                    }}
                />
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: tokens.fontWeights.semibold }}
                >
                    Aucune dépense
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Utilisez le bouton "Nouvelle dépense" pour commencer à suivre vos frais.
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            <ExpenseStats stats={stats} />
            <Box sx={{ mt: 3 }}>
                <ExpenseTable expenses={expenses} />
            </Box>
        </>
    );
}
