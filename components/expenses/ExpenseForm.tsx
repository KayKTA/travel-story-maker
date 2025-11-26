'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { Close as CloseIcon } from '@mui/icons-material';
import {
    EXPENSE_CATEGORIES,
    CURRENCIES,
    type ExpenseFormData,
    type ExpenseCategory,
} from '@/types/expense';
import { validateExpense } from '@/lib/utils/validators';
import { getSupabaseClient } from '@/lib/supabase/client';

interface ExpenseFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    tripId: string;
    tripName?: string;
    initialData?: Partial<ExpenseFormData>;
    isEditing?: boolean;
}

const emptyFormData: ExpenseFormData = {
    trip_id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: 'EUR',
    category: 'autre',
    label: '',
    notes: '',
};

// Z-index for dropdowns
const selectMenuProps = {
    sx: { zIndex: 1500 },
};

const datePickerPopperProps = {
    sx: { zIndex: 1500 },
};

export default function ExpenseForm({
    open,
    onClose,
    onSubmit,
    tripId,
    tripName,
    initialData,
    isEditing = false,
}: ExpenseFormProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState<ExpenseFormData>({
        ...emptyFormData,
        trip_id: tripId,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    trip_id: tripId,
                    date: initialData.date || new Date().toISOString().split('T')[0],
                    amount: initialData.amount || 0,
                    currency: initialData.currency || 'EUR',
                    category: initialData.category || 'autre',
                    label: initialData.label || '',
                    notes: initialData.notes || '',
                });
            } else {
                setFormData({
                    ...emptyFormData,
                    trip_id: tripId,
                });
            }
            setErrors([]);
        }
    }, [open, initialData, tripId]);

    const handleChange = (field: keyof ExpenseFormData, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors([]);
    };

    const handleSubmit = async () => {
        const validation = validateExpense(formData);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        setErrors([]);

        try {
            const supabase = getSupabaseClient();

            const { error } = await supabase.from('expenses').insert({
                trip_id: tripId,
                expense_date: formData.date,
                amount: formData.amount,
                currency: formData.currency,
                category: formData.category,
                label: formData.label || null,
                notes: formData.notes || null,
            });

            if (error) throw error;

            await onSubmit();
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            setErrors(['Une erreur est survenue. Veuillez réessayer.']);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const selectedCurrency = CURRENCIES.find((c) => c.code === formData.currency);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            sx={{ zIndex: 1300 }}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'warning.main',
                    color: 'white',
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {isEditing ? 'Modifier la dépense' : 'Nouvelle dépense'}
                    </Typography>
                    {tripName && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {tripName}
                        </Typography>
                    )}
                </Box>
                <IconButton onClick={handleClose} disabled={loading} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ pt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {errors.length > 0 && (
                            <Alert severity="error">
                                {errors.map((err, i) => (
                                    <div key={i}>{err}</div>
                                ))}
                            </Alert>
                        )}

                        {/* Amount & Currency - Most important first */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 8 }}>
                                <TextField
                                    label="Montant"
                                    type="number"
                                    value={formData.amount || ''}
                                    onChange={(e) =>
                                        handleChange('amount', parseFloat(e.target.value) || 0)
                                    }
                                    required
                                    fullWidth
                                    inputProps={{ min: 0, step: '0.01' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {selectedCurrency?.symbol || '€'}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Devise</InputLabel>
                                    <Select
                                        value={formData.currency}
                                        label="Devise"
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        MenuProps={selectMenuProps}
                                    >
                                        {CURRENCIES.map((currency) => (
                                            <MenuItem key={currency.code} value={currency.code}>
                                                {currency.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Category */}
                        <FormControl fullWidth required>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                value={formData.category}
                                label="Catégorie"
                                onChange={(e) =>
                                    handleChange('category', e.target.value as ExpenseCategory)
                                }
                                MenuProps={selectMenuProps}
                            >
                                {EXPENSE_CATEGORIES.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>
                                        {cat.emoji} {cat.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date */}
                        <DatePicker
                            label="Date"
                            value={formData.date ? new Date(formData.date) : null}
                            onChange={(date) =>
                                handleChange(
                                    'date',
                                    date ? date.toISOString().split('T')[0] : ''
                                )
                            }
                            slotProps={{
                                textField: { fullWidth: true, required: true },
                                popper: datePickerPopperProps,
                            }}
                        />

                        {/* Label */}
                        <TextField
                            label="Description"
                            value={formData.label || ''}
                            onChange={(e) => handleChange('label', e.target.value)}
                            fullWidth
                            placeholder="Ex: Billet de bus, Restaurant..."
                        />

                        {/* Notes */}
                        <TextField
                            label="Notes"
                            value={formData.notes || ''}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                            placeholder="Notes additionnelles..."
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading || !formData.amount}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    color="warning"
                    sx={{ py: 1.5, borderRadius: 2 }}
                >
                    {loading ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Ajouter la dépense'}
                </Button>
            </Box>
        </Dialog>
    );
}
