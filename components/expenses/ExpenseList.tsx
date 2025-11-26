'use client';

import { Box, Typography, Paper } from '@mui/material';
import ExpenseTable from './ExpenseTable';
import ExpenseStats from './ExpenseStats';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import type { Expense, ExpensesByCategory } from '@/types';

interface ExpenseListProps {
    expenses: Expense[];
    tripId?: string;
    onRefresh?: () => void;
}

export default function ExpenseList({ expenses, tripId, onRefresh }: ExpenseListProps) {
    // Calculate stats
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

    const stats = {
        total: totalAmount,
        currency: 'EUR',
        by_category: categoriesStats,
        count: expenses.length,
    };

    if (expenses.length === 0) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <ReceiptIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
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
