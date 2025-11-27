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
    Card,
    CardContent,
    Stack,
    Divider,
    useMediaQuery,
    useTheme,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getCategoryInfo = (category: string) => {
        return EXPENSE_CATEGORIES.find((c) => c.value === category) || {
            label: category,
            emoji: '📦',
            color: '#6B7280',
        };
    };

    // Mobile Card View
    if (isMobile) {
        return (
            <Stack spacing={2}>
                {expenses.map((expense) => {
                    const categoryInfo = getCategoryInfo(expense.category);
                    const expenseWithTrip = expense as ExpenseWithTrip;

                    return (
                        <Card key={expense.id} sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Stack spacing={2}>
                                    {/* Header: Category and Amount */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                        }}
                                    >
                                        <Chip
                                            label={`${categoryInfo.emoji} ${categoryInfo.label}`}
                                            size="small"
                                            sx={{
                                                bgcolor: `${categoryInfo.color}15`,
                                                color: categoryInfo.color,
                                                fontWeight: 500,
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 600, color: 'text.primary' }}
                                        >
                                            {formatCurrency(expense.amount, expense.currency)}
                                        </Typography>
                                    </Box>

                                    {/* Description */}
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: '0.75rem', mb: 0.5 }}
                                        >
                                            Description
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body1">
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
                                    </Box>

                                    <Divider />

                                    {/* Footer: Date, Trip, Actions */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDateShort(expense.date)}
                                            </Typography>
                                            {showTrip && expenseWithTrip.trip && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {expenseWithTrip.trip.country}
                                                    {expenseWithTrip.trip.city &&
                                                        ` - ${expenseWithTrip.trip.city}`}
                                                </Typography>
                                            )}
                                        </Stack>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {onEdit && (
                                                <IconButton
                                                    onClick={() => onEdit(expense)}
                                                    size="large"
                                                    sx={{ minWidth: 44, minHeight: 44 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton
                                                    onClick={() => onDelete(expense)}
                                                    color="error"
                                                    size="large"
                                                    sx={{ minWidth: 44, minHeight: 44 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>
        );
    }

    // Desktop Table View
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
