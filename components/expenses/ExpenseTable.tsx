'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Box,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { formatDateShort, formatCurrency } from '@/lib/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/types/expense';
import type { Expense, ExpenseWithTrip } from '@/types';

interface ExpenseTableProps {
    expenses: (Expense | ExpenseWithTrip)[];
    showTrip?: boolean;
    onEdit?: (expense: Expense) => void;
    onDelete?: (expense: Expense) => void;
}

export default function ExpenseTable({
    expenses,
    showTrip = true,
    onEdit,
    onDelete,
}: ExpenseTableProps) {
    const getCategoryInfo = (category: string) => {
        return EXPENSE_CATEGORIES.find((c) => c.value === category) || {
            label: category,
            emoji: '📦',
            color: '#6B7280',
        };
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell>Date</TableCell>
                        <TableCell>Catégorie</TableCell>
                        <TableCell>Description</TableCell>
                        {showTrip && <TableCell>Voyage</TableCell>}
                        <TableCell align="right">Montant</TableCell>
                        <TableCell align="center" width={100}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((expense) => {
                        const categoryInfo = getCategoryInfo(expense.category);
                        const expenseWithTrip = expense as ExpenseWithTrip;

                        return (
                            <TableRow
                                key={expense.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { bgcolor: 'grey.50' },
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDateShort(expense.date)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${categoryInfo.emoji} ${categoryInfo.label}`}
                                        size="small"
                                        sx={{
                                            bgcolor: `${categoryInfo.color}15`,
                                            color: categoryInfo.color,
                                            fontWeight: 500,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2">
                                            {expense.label || '-'}
                                        </Typography>
                                        {expense.receipt_image_url && (
                                            <Tooltip title="Ticket disponible">
                                                <ReceiptIcon
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ opacity: 0.6 }}
                                                />
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                                {showTrip && (
                                    <TableCell>
                                        {expenseWithTrip.trip ? (
                                            <Typography variant="body2" color="text.secondary">
                                                {expenseWithTrip.trip.country}
                                                {expenseWithTrip.trip.city &&
                                                    ` - ${expenseWithTrip.trip.city}`}
                                            </Typography>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                )}
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600, color: 'text.primary' }}
                                    >
                                        {formatCurrency(expense.amount, expense.currency)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        {onEdit && (
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(expense)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton
                                                size="small"
                                                onClick={() => onDelete(expense)}
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
