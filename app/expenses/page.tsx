import { Suspense } from 'react';
import { Box, Container, Skeleton } from '@mui/material';
import { Add as AddIcon, CameraAlt as ScanIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import ExpenseStats from '@/components/expenses/ExpenseStats';
import { createClient } from '@/lib/supabase/server';
import type { ExpenseWithTrip, ExpensesByCategory } from '@/types';

async function getExpensesData() {
    const supabase = await createClient();

    // Get all expenses with trip info
    const { data: expenses, error } = await supabase
        .from('expenses')
        .select(`
      *,
      trips:trip_id (
        id,
        country,
        city
      )
    `)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching expenses:', error);
        return { expenses: [], stats: null };
    }

    const expensesWithTrip = (expenses || []).map((e) => ({
        ...e,
        trip: e.trips,
    })) as ExpenseWithTrip[];

    // Calculate stats
    const totalAmount = expensesWithTrip.reduce((sum, e) => sum + e.amount, 0);

    // Group by category
    const byCategory: Record<string, { amount: number; count: number }> = {};
    expensesWithTrip.forEach((e) => {
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
            currency: 'EUR', // Assuming default currency
        })
    );

    return {
        expenses: expensesWithTrip,
        stats: {
            total: totalAmount,
            currency: 'EUR',
            by_category: categoriesStats,
            count: expensesWithTrip.length,
        },
    };
}

function ExpensesLoading() {
    return (
        <Box>
            <Skeleton variant="rounded" height={120} sx={{ mb: 3, borderRadius: 3 }} />
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
        </Box>
    );
}

async function ExpensesContent() {
    const { expenses, stats } = await getExpensesData();

    return (
        <>
            {stats && <ExpenseStats stats={stats} />}
            <Box sx={{ mt: 3 }}>
                <ExpenseTable expenses={expenses} />
            </Box>
        </>
    );
}

export default function ExpensesPage() {
    return (
        <Box>
            <PageHeader
                title="Dépenses"
                subtitle="Suivez toutes vos dépenses de voyage"
                action={{
                    label: 'Ajouter',
                    icon: <AddIcon />,
                    href: '/expenses?new=true',
                }}
                secondaryAction={{
                    label: 'Scanner ticket',
                    icon: <ScanIcon />,
                    href: '/expenses?scan=true',
                }}
            />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Suspense fallback={<ExpensesLoading />}>
                    <ExpensesContent />
                </Suspense>
            </Container>
        </Box>
    );
}
