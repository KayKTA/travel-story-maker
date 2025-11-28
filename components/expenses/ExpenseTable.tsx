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
import { tokens, flexCenter } from '@/styles';
import type { Expense, ExpenseWithTrip } from '@/types';

interface ExpenseTableProps {
    expenses: (Expense | ExpenseWithTrip)[];
    showTrip?: boolean;
    onEdit?: (expense: Expense) => void;
    onDelete?: (expense: Expense) => void;
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

export default function ExpenseTable({
    expenses,
    showTrip = true,
    onEdit,
    onDelete,
}: ExpenseTableProps) {
    return (
        <TableContainer
            component={Paper}
            sx={{ borderRadius: tokens.radius.lg }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: tokens.fontWeights.semibold }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: tokens.fontWeights.semibold }}>Catégorie</TableCell>
                        <TableCell sx={{ fontWeight: tokens.fontWeights.semibold }}>Description</TableCell>
                        {showTrip && (
                            <TableCell sx={{ fontWeight: tokens.fontWeights.semibold }}>Voyage</TableCell>
                        )}
                        <TableCell align="right" sx={{ fontWeight: tokens.fontWeights.semibold }}>
                            Montant
                        </TableCell>
                        <TableCell align="center" width={100} sx={{ fontWeight: tokens.fontWeights.semibold }}>
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
                                    '&:hover': { bgcolor: 'action.hover' },
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
                                            fontWeight: tokens.fontWeights.medium,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2">{expense.label || '-'}</Typography>
                                        {expense.receipt_image_url && (
                                            <Tooltip title="Ticket disponible">
                                                <ReceiptIcon fontSize="small" color="action" sx={{ opacity: 0.6 }} />
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                                {showTrip && (
                                    <TableCell>
                                        {expenseWithTrip.trip ? (
                                            <Typography variant="body2" color="text.secondary">
                                                {expenseWithTrip.trip.country}
                                                {expenseWithTrip.trip.city && ` - ${expenseWithTrip.trip.city}`}
                                            </Typography>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                )}
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: tokens.fontWeights.semibold, color: 'text.primary' }}
                                    >
                                        {formatCurrency(expense.amount, expense.currency)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={flexCenter}>
                                        {onEdit && (
                                            <IconButton size="small" onClick={() => onEdit(expense)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton size="small" onClick={() => onDelete(expense)} color="error">
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
