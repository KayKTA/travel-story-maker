'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    TextField,
    Chip,
    Alert,
    Tabs,
    Tab,
    Divider,
    Stack,
    Paper,
    Avatar,
    Badge,
    LinearProgress,
    Tooltip,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Favorite as FavoriteIcon,
    Photo as PhotoIcon,
    Videocam as VideoIcon,
    CalendarMonth as CalendarIcon,
    Place as PlaceIcon,
    Euro as EuroIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Flight as FlightIcon,
    Hotel as HotelIcon,
    Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { tokens, moodColors, categoryColors } from '@/styles';
import {
    EmptyState,
    IconChip,
    CountBadge,
    StatItem,
    LoadingState,
    ConfirmDialog,
    DrawerHandle,
    TimelineDot,
    PhotoThumbnailList,
} from '@/components/common';
import { useDisclosure } from '@/lib/hooks';

// Section component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box sx={{ mb: 6 }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: tokens.fontWeights.bold,
                    mb: 3,
                    pb: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
}

// Color swatch component
function ColorSwatch({ name, color, textColor = '#fff' }: { name: string; color: string; textColor?: string }) {
    return (
        <Box
            sx={{
                bgcolor: color,
                color: textColor,
                p: 2,
                borderRadius: 1,
                minWidth: 120,
            }}
        >
            <Typography variant="caption" sx={{ fontWeight: tokens.fontWeights.medium }}>
                {name}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                {color}
            </Typography>
        </Box>
    );
}

// Spacing preview component
function SpacingPreview({ name, value }: { name: string; value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" sx={{ width: 60, fontFamily: 'monospace' }}>
                {name}
            </Typography>
            <Box
                sx={{
                    width: value * 4,
                    height: 24,
                    bgcolor: 'primary.main',
                    borderRadius: 0.5,
                }}
            />
            <Typography variant="caption" color="text.secondary">
                {value * 4}px
            </Typography>
        </Box>
    );
}

// Radius preview component
function RadiusPreview({ name, value }: { name: string; value: number | string }) {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box
                sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    borderRadius: typeof value === 'number' ? `${value}px` : value,
                    mx: 'auto',
                    mb: 1,
                }}
            />
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                {name}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
                {typeof value === 'number' ? `${value}px` : value}
            </Typography>
        </Box>
    );
}

export default function DesignSystemPage() {
    const [tabValue, setTabValue] = useState(0);
    const confirmDialog = useDisclosure();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 6 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" sx={{ fontWeight: tokens.fontWeights.bold }}>
                        Design System
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, opacity: 0.8 }}>
                        Travel Story Maker - Composants et Styles
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                {/* ============================================================ */}
                {/* COLORS */}
                {/* ============================================================ */}
                <Section title="🎨 Couleurs">
                    <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                        Palette de couleurs du thème minimaliste jaune
                    </Typography>

                    {/* Primary */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                        Primary
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                        <ColorSwatch name="Main" color="#FACC15" textColor="#18181B" />
                        <ColorSwatch name="Light" color="#FDE047" textColor="#18181B" />
                        <ColorSwatch name="Dark" color="#EAB308" textColor="#18181B" />
                        <ColorSwatch name="Contrast" color="#18181B" />
                    </Stack>

                    {/* Secondary */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                        Secondary (Slate)
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                        <ColorSwatch name="Main" color="#64748B" />
                        <ColorSwatch name="Light" color="#94A3B8" textColor="#18181B" />
                        <ColorSwatch name="Dark" color="#475569" />
                    </Stack>

                    {/* Semantic */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                        Semantic
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                        <ColorSwatch name="Success" color="#22C55E" />
                        <ColorSwatch name="Warning" color="#F59E0B" textColor="#18181B" />
                        <ColorSwatch name="Error" color="#EF4444" />
                        <ColorSwatch name="Info" color="#3B82F6" />
                    </Stack>

                    {/* Background & Text */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                        Background & Text
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                        <ColorSwatch name="Default" color="#FAFAFA" textColor="#18181B" />
                        <ColorSwatch name="Paper" color="#FFFFFF" textColor="#18181B" />
                        <ColorSwatch name="Subtle" color="#F4F4F5" textColor="#18181B" />
                        <ColorSwatch name="Border" color="#E4E4E7" textColor="#18181B" />
                        <ColorSwatch name="Text Primary" color="#18181B" />
                        <ColorSwatch name="Text Secondary" color="#71717A" />
                    </Stack>

                    {/* Mood Colors */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                        Mood Colors (Journal)
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(moodColors).map(([name, color]) => (
                            <ColorSwatch key={name} name={name} color={color} />
                        ))}
                    </Stack>
                </Section>

                {/* ============================================================ */}
                {/* TYPOGRAPHY */}
                {/* ============================================================ */}
                <Section title="📝 Typographie">
                    <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                        Famille: Inter / SF Pro Display / System
                    </Typography>

                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="h1">Heading 1 (2.5rem / 600)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h2">Heading 2 (2rem / 600)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3">Heading 3 (1.5rem / 600)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4">Heading 4 (1.25rem / 600)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h5">Heading 5 (1.125rem / 600)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6">Heading 6 (1rem / 600)</Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle1">Subtitle 1 (1rem / 500)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Subtitle 2 (0.875rem / 500)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1">Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2">Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption">Caption - Small text for annotations</Typography>
                        </Box>
                    </Stack>
                </Section>

                {/* ============================================================ */}
                {/* SPACING */}
                {/* ============================================================ */}
                <Section title="📏 Spacing">
                    <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                        Base unit: 4px (MUI spacing)
                    </Typography>

                    <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: 1, borderColor: 'divider' }}>
                        <SpacingPreview name="xs (1)" value={1} />
                        <SpacingPreview name="sm (2)" value={2} />
                        <SpacingPreview name="md (4)" value={4} />
                        <SpacingPreview name="lg (6)" value={6} />
                        <SpacingPreview name="xl (8)" value={8} />
                        <SpacingPreview name="xxl (12)" value={12} />
                    </Box>
                </Section>

                {/* ============================================================ */}
                {/* BORDER RADIUS */}
                {/* ============================================================ */}
                <Section title="⬜ Border Radius">
                    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 3 }}>
                        <RadiusPreview name="xs" value={tokens.radius.xs} />
                        <RadiusPreview name="sm" value={tokens.radius.sm} />
                        <RadiusPreview name="md" value={tokens.radius.md} />
                        <RadiusPreview name="lg" value={tokens.radius.lg} />
                        <RadiusPreview name="xl" value={tokens.radius.xl} />
                        <RadiusPreview name="circle" value={tokens.radius.circle} />
                    </Stack>
                </Section>

                {/* ============================================================ */}
                {/* BUTTONS */}
                {/* ============================================================ */}
                <Section title="🔘 Buttons">
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Variants
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                                <Button variant="contained">Contained</Button>
                                <Button variant="outlined">Outlined</Button>
                                <Button variant="text">Text</Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Colors
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                                <Button variant="contained" color="primary">Primary</Button>
                                <Button variant="contained" color="secondary">Secondary</Button>
                                <Button variant="contained" color="success">Success</Button>
                                <Button variant="contained" color="error">Error</Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                With Icons
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                                <Button variant="contained" startIcon={<AddIcon />}>Ajouter</Button>
                                <Button variant="outlined" startIcon={<EditIcon />}>Modifier</Button>
                                <Button variant="text" color="error" startIcon={<DeleteIcon />}>Supprimer</Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Sizes
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                                <Button variant="contained" size="small">Small</Button>
                                <Button variant="contained" size="medium">Medium</Button>
                                <Button variant="contained" size="large">Large</Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Icon Buttons
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton><AddIcon /></IconButton>
                                <IconButton color="primary"><EditIcon /></IconButton>
                                <IconButton color="error"><DeleteIcon /></IconButton>
                                <IconButton disabled><FavoriteIcon /></IconButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Section>

                {/* ============================================================ */}
                {/* INPUTS */}
                {/* ============================================================ */}
                <Section title="📝 Form Inputs">
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Text Field" placeholder="Placeholder..." fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="With Value" value="Hello World" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Error State" error helperText="This field is required" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Disabled" disabled value="Cannot edit" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Multiline" multiline rows={3} placeholder="Write something..." fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Select</InputLabel>
                                <Select label="Select" defaultValue="">
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={3}>
                                <FormControlLabel control={<Switch />} label="Switch" />
                                <FormControlLabel control={<Switch defaultChecked />} label="Switch On" />
                                <FormControlLabel control={<Switch disabled />} label="Disabled" />
                            </Stack>
                        </Grid>
                    </Grid>
                </Section>

                {/* ============================================================ */}
                {/* CHIPS */}
                {/* ============================================================ */}
                <Section title="🏷️ Chips">
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Default Chips
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Chip label="Default" />
                                <Chip label="Primary" color="primary" />
                                <Chip label="Secondary" color="secondary" />
                                <Chip label="Success" color="success" />
                                <Chip label="Error" color="error" />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Outlined Chips
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Chip label="Default" variant="outlined" />
                                <Chip label="Primary" variant="outlined" color="primary" />
                                <Chip label="Clickable" variant="outlined" onClick={() => { }} />
                                <Chip label="Deletable" variant="outlined" onDelete={() => { }} />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                With Icons
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Chip icon={<PhotoIcon />} label="12 photos" />
                                <Chip icon={<VideoIcon />} label="3 videos" />
                                <Chip icon={<CalendarIcon />} label="15-20 Nov" />
                                <Chip icon={<PlaceIcon />} label="Paris" />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                IconChip (Custom)
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <IconChip icon={<PhotoIcon />} label="Filled" variant="filled" />
                                <IconChip icon={<VideoIcon />} label="Outlined" variant="outlined" />
                                <IconChip icon={<EuroIcon />} label="Subtle" variant="subtle" />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                CountBadge (Custom)
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <CountBadge count={12} singular="photo" plural="photos" variant="primary" />
                                <CountBadge count={1} singular="video" plural="videos" variant="secondary" />
                                <CountBadge count={5} variant="default" />
                            </Stack>
                        </Grid>
                    </Grid>
                </Section>

                {/* ============================================================ */}
                {/* CARDS */}
                {/* ============================================================ */}
                <Section title="🃏 Cards">
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Basic Card
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        A simple card with content. Cards have a subtle border and hover effect.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <Box
                                    sx={{
                                        height: 120,
                                        bgcolor: 'primary.main',
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        With Header
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Card with a colored header area.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>J</Avatar>
                                        <Box>
                                            <Typography variant="subtitle2">Japon</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                15 Nov - 30 Nov 2024
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <StatItem icon={<PhotoIcon fontSize="small" />} value={24} />
                                        <StatItem icon={<VideoIcon fontSize="small" />} value={3} />
                                        <StatItem icon={<EuroIcon fontSize="small" />} value="1,250€" />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Section>

                {/* ============================================================ */}
                {/* ALERTS */}
                {/* ============================================================ */}
                <Section title="⚠️ Alerts">
                    <Stack spacing={2}>
                        <Alert severity="success">Voyage créé avec succès !</Alert>
                        <Alert severity="info">Vous pouvez ajouter des photos à votre journal.</Alert>
                        <Alert severity="warning">Cette action est irréversible.</Alert>
                        <Alert severity="error">Une erreur est survenue. Veuillez réessayer.</Alert>
                        <Alert severity="info" onClose={() => { }}>
                            Alert with close button
                        </Alert>
                    </Stack>
                </Section>

                {/* ============================================================ */}
                {/* TABS */}
                {/* ============================================================ */}
                <Section title="📑 Tabs">
                    <Paper sx={{ border: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                            <Tab label="Aperçu" />
                            <Tab label="Itinéraire" />
                            <Tab label="Médias" />
                            <Tab label="Dépenses" />
                        </Tabs>
                        <Box sx={{ p: 3 }}>
                            <Typography>
                                Contenu de l'onglet {tabValue + 1}
                            </Typography>
                        </Box>
                    </Paper>
                </Section>

                {/* ============================================================ */}
                {/* BADGES & AVATARS */}
                {/* ============================================================ */}
                <Section title="👤 Avatars & Badges">
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Avatars
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Avatar>A</Avatar>
                                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>B</Avatar>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>C</Avatar>
                                <Avatar sx={{ bgcolor: 'success.main' }}>D</Avatar>
                                <Avatar sx={{ bgcolor: 'error.main' }}>E</Avatar>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                Badges
                            </Typography>
                            <Stack direction="row" spacing={3}>
                                <Badge badgeContent={4} color="primary">
                                    <Avatar>N</Avatar>
                                </Badge>
                                <Badge badgeContent={99} color="error">
                                    <Avatar>E</Avatar>
                                </Badge>
                                <Badge variant="dot" color="success">
                                    <Avatar>O</Avatar>
                                </Badge>
                            </Stack>
                        </Grid>
                    </Grid>
                </Section>

                {/* ============================================================ */}
                {/* PROGRESS */}
                {/* ============================================================ */}
                <Section title="📊 Progress">
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Default</Typography>
                            <LinearProgress variant="determinate" value={50} />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Primary</Typography>
                            <LinearProgress variant="determinate" value={70} color="primary" />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Success</Typography>
                            <LinearProgress variant="determinate" value={100} color="success" />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Indeterminate</Typography>
                            <LinearProgress />
                        </Box>
                    </Stack>
                </Section>

                {/* ============================================================ */}
                {/* CUSTOM COMPONENTS */}
                {/* ============================================================ */}
                <Section title="🧩 Custom Components">
                    <Grid container spacing={4}>
                        {/* StatItem */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                StatItem
                            </Typography>
                            <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                                <Stack direction="row" spacing={3}>
                                    <StatItem icon={<PhotoIcon fontSize="small" />} value={24} label="photos" />
                                    <StatItem icon={<VideoIcon fontSize="small" />} value={3} label="vidéos" />
                                    <StatItem icon={<EuroIcon fontSize="small" />} value="1,250€" />
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* TimelineDot */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                TimelineDot
                            </Typography>
                            <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TimelineDot index={1} color={moodColors.amazing} />
                                    <TimelineDot index={2} color={moodColors.happy} />
                                    <TimelineDot index={3} color={moodColors.adventurous} isSelected />
                                    <TimelineDot index={4} color={moodColors.tired} />
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* DrawerHandle */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                DrawerHandle
                            </Typography>
                            <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                                <DrawerHandle />
                            </Paper>
                        </Grid>

                        {/* LoadingState */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                LoadingState
                            </Typography>
                            <Paper sx={{ border: 1, borderColor: 'divider' }}>
                                <LoadingState message="Chargement..." height={150} />
                            </Paper>
                        </Grid>

                        {/* EmptyState */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                EmptyState
                            </Typography>
                            <Paper sx={{ border: 1, borderColor: 'divider' }}>
                                <EmptyState
                                    icon={<FlightIcon sx={{ fontSize: 48 }} />}
                                    title="Aucun voyage"
                                    description="Commencez par créer votre premier voyage pour enregistrer vos aventures."
                                    actionLabel="Créer un voyage"
                                    onAction={() => { }}
                                />
                            </Paper>
                        </Grid>

                        {/* ConfirmDialog */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: tokens.fontWeights.semibold }}>
                                ConfirmDialog
                            </Typography>
                            <Button variant="outlined" color="error" onClick={confirmDialog.onOpen}>
                                Ouvrir ConfirmDialog
                            </Button>
                            <ConfirmDialog
                                open={confirmDialog.isOpen}
                                onClose={confirmDialog.onClose}
                                onConfirm={confirmDialog.onClose}
                                title="Supprimer ce voyage ?"
                                message="Cette action est irréversible. Toutes les données associées seront perdues."
                                confirmLabel="Supprimer"
                                confirmColor="error"
                            />
                        </Grid>
                    </Grid>
                </Section>

                {/* ============================================================ */}
                {/* CATEGORY COLORS */}
                {/* ============================================================ */}
                <Section title="💰 Category Colors (Expenses)">
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(categoryColors).map(([name, color]) => (
                            <Chip
                                key={name}
                                label={name}
                                sx={{
                                    bgcolor: color,
                                    color: '#fff',
                                    fontWeight: tokens.fontWeights.medium,
                                }}
                            />
                        ))}
                    </Stack>
                </Section>

                {/* ============================================================ */}
                {/* TOKENS REFERENCE */}
                {/* ============================================================ */}
                <Section title="📋 Tokens Reference">
                    <Paper sx={{ p: 3, border: 1, borderColor: 'divider', bgcolor: 'background.subtle' }}>
                        <Typography
                            component="pre"
                            sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                overflow: 'auto',
                                m: 0,
                            }}
                        >
                            {`import { tokens } from '@/styles';

// Spacing
tokens.spacing.xs   // 1 (4px)
tokens.spacing.sm   // 2 (8px)
tokens.spacing.md   // 4 (16px)
tokens.spacing.lg   // 6 (24px)
tokens.spacing.xl   // 8 (32px)

// Radius
tokens.radius.xs    // 2px
tokens.radius.sm    // 4px
tokens.radius.md    // 6px
tokens.radius.lg    // 8px
tokens.radius.xl    // 12px

// Font Weights
tokens.fontWeights.regular   // 400
tokens.fontWeights.medium    // 500
tokens.fontWeights.semibold  // 600
tokens.fontWeights.bold      // 600

// Transitions
tokens.transitions.fast     // 0.15s ease
tokens.transitions.normal   // 0.2s ease
tokens.transitions.slow     // 0.3s ease

// Z-Index
tokens.zIndex.header   // 10
tokens.zIndex.drawer   // 1200
tokens.zIndex.modal    // 1300
tokens.zIndex.tooltip  // 1500`}
                        </Typography>
                    </Paper>
                </Section>
            </Container>
        </Box>
    );
}
