'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
    ToggleButton,
    ToggleButtonGroup,
    Collapse,
    IconButton,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    FilterList as FilterIcon,
    ExpandMore as ExpandIcon,
    ExpandLess as CollapseIcon,
    Photo as PhotoIcon,
    Book as JournalIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDateLong } from '@/lib/utils/formatters';
import { JOURNAL_MOODS } from '@/types/journal';
import type { JournalEntry, MediaAsset } from '@/types';

// Fix for default marker icon in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Custom numbered marker for journal entries
const createNumberedIcon = (number: number, color: string = '#1976d2') => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background-color: ${color};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">${number}</div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
};

// Custom photo marker
const createPhotoIcon = () => {
    return L.divIcon({
        className: 'photo-marker',
        html: `
      <div style="
        background-color: #2196F3;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">📷</div>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

L.Marker.prototype.options.icon = DefaultIcon;

interface MapStep {
    id: string;
    date: string;
    location: string | null;
    lat: number;
    lng: number;
    mood?: string | null;
    content: string;
    stepNumber: number;
}

interface MapMedia {
    id: string;
    lat: number;
    lng: number;
    url: string;
    thumbnailUrl?: string | null;
    takenAt: string | null;
    type: 'photo' | 'video';
}

type ViewMode = 'journal' | 'media' | 'both';

interface TripMapProps {
    journalEntries: JournalEntry[];
    media?: MediaAsset[];
    tripLat?: number | null;
    tripLng?: number | null;
}

// Component to fit map bounds
function FitBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [map, positions]);

    return null;
}

export default function TripMap({ journalEntries, media = [], tripLat, tripLng }: TripMapProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('journal');
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showPath, setShowPath] = useState(true);

    // Get all unique locations
    const allLocations = useMemo(() => {
        const locations = new Set<string>();
        journalEntries.forEach((entry) => {
            if (entry.location) locations.add(entry.location);
        });
        return Array.from(locations).sort();
    }, [journalEntries]);

    // Get all used moods
    const usedMoods = useMemo(() => {
        const moods = new Set<string>();
        journalEntries.forEach((entry) => {
            if (entry.mood) moods.add(entry.mood);
        });
        return JOURNAL_MOODS.filter((m) => moods.has(m.value));
    }, [journalEntries]);

    // Filter and prepare journal steps
    const steps: MapStep[] = useMemo(() => {
        let filtered = journalEntries.filter((entry) => entry.lat && entry.lng);

        // Apply mood filter
        if (selectedMoods.length > 0) {
            filtered = filtered.filter((entry) => entry.mood && selectedMoods.includes(entry.mood));
        }

        // Apply location filter
        if (selectedLocations.length > 0) {
            filtered = filtered.filter((entry) => entry.location && selectedLocations.includes(entry.location));
        }

        // Sort by date
        filtered.sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());

        return filtered.map((entry, index) => ({
            id: entry.id,
            date: entry.entry_date,
            location: entry.location,
            lat: entry.lat!,
            lng: entry.lng!,
            mood: entry.mood,
            content: entry.content,
            stepNumber: index + 1,
        }));
    }, [journalEntries, selectedMoods, selectedLocations]);

    // Filter and prepare media markers
    const mediaMarkers: MapMedia[] = useMemo(() => {
        return media
            .filter((m) => m.lat && m.lng)
            .map((m) => ({
                id: m.id,
                lat: m.lat!,
                lng: m.lng!,
                url: m.url,
                thumbnailUrl: m.thumbnail_url,
                takenAt: m.taken_at,
                type: m.media_type,
            }));
    }, [media]);

    // Get all positions for bounds
    const allPositions: [number, number][] = useMemo(() => {
        const positions: [number, number][] = [];

        if (viewMode === 'journal' || viewMode === 'both') {
            steps.forEach((s) => positions.push([s.lat, s.lng]));
        }

        if (viewMode === 'media' || viewMode === 'both') {
            mediaMarkers.forEach((m) => positions.push([m.lat, m.lng]));
        }

        return positions;
    }, [steps, mediaMarkers, viewMode]);

    // Polyline positions
    const polylinePositions: [number, number][] = useMemo(() => {
        return steps.map((step) => [step.lat, step.lng]);
    }, [steps]);

    // Calculate center
    const mapCenter = useMemo(() => {
        if (allPositions.length > 0) {
            const avgLat = allPositions.reduce((sum, p) => sum + p[0], 0) / allPositions.length;
            const avgLng = allPositions.reduce((sum, p) => sum + p[1], 0) / allPositions.length;
            return [avgLat, avgLng] as [number, number];
        }
        if (tripLat && tripLng) {
            return [tripLat, tripLng] as [number, number];
        }
        return [0, 0] as [number, number];
    }, [allPositions, tripLat, tripLng]);

    const hasJournalGps = journalEntries.some((e) => e.lat && e.lng);
    const hasMediaGps = mediaMarkers.length > 0;

    if (!hasJournalGps && !hasMediaGps) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <LocationIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Aucune position GPS
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ajoutez des entrées de journal avec des photos géolocalisées pour voir votre itinéraire.
                </Typography>
            </Paper>
        );
    }

    const activeFiltersCount = selectedMoods.length + selectedLocations.length;

    return (
        <Box>
            {/* Controls */}
            <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    {/* View Mode Toggle */}
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, value) => value && setViewMode(value)}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: { xs: 1, sm: 2 },
                                py: 0.5,
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            },
                        }}
                    >
                        <ToggleButton value="journal" disabled={!hasJournalGps}>
                            <JournalIcon sx={{ mr: { xs: 0, sm: 0.5 }, fontSize: 18 }} />
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Journal</Box>
                            <Box component="span" sx={{ ml: 0.5 }}>({steps.length})</Box>
                        </ToggleButton>
                        <ToggleButton value="media" disabled={!hasMediaGps}>
                            <PhotoIcon sx={{ mr: { xs: 0, sm: 0.5 }, fontSize: 18 }} />
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Médias</Box>
                            <Box component="span" sx={{ ml: 0.5 }}>({mediaMarkers.length})</Box>
                        </ToggleButton>
                        <ToggleButton value="both" disabled={!hasJournalGps || !hasMediaGps}>
                            Tous
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Filter Toggle */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {(viewMode === 'journal' || viewMode === 'both') && (
                            <Chip
                                label={showPath ? '📍' : '⋯'}
                                onClick={() => setShowPath(!showPath)}
                                variant={showPath ? 'filled' : 'outlined'}
                                size="small"
                                sx={{ minWidth: 32 }}
                            />
                        )}
                        <IconButton
                            onClick={() => setShowFilters(!showFilters)}
                            size="small"
                            sx={{ position: 'relative' }}
                        >
                            <FilterIcon fontSize="small" color={activeFiltersCount > 0 ? 'primary' : 'inherit'} />
                            {activeFiltersCount > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontSize: 9,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {activeFiltersCount}
                                </Box>
                            )}
                        </IconButton>
                    </Box>
                </Box>

                {/* Filters */}
                <Collapse in={showFilters}>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                        {/* Mood Filter */}
                        <FormControl size="small" sx={{ minWidth: { xs: 140, sm: 200 }, flex: { xs: 1, sm: 'none' } }}>
                            <InputLabel>Humeur</InputLabel>
                            <Select
                                multiple
                                value={selectedMoods}
                                onChange={(e) => setSelectedMoods(e.target.value as string[])}
                                input={<OutlinedInput label="Humeur" />}
                                renderValue={(selected) =>
                                    selected.map((v) => JOURNAL_MOODS.find((m) => m.value === v)?.emoji).join(' ')
                                }
                                MenuProps={{ sx: { zIndex: 1500 } }}
                            >
                                {usedMoods.map((mood) => (
                                    <MenuItem key={mood.value} value={mood.value}>
                                        <Checkbox checked={selectedMoods.includes(mood.value)} size="small" />
                                        <ListItemText primary={`${mood.emoji} ${mood.label}`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Location Filter */}
                        <FormControl size="small" sx={{ minWidth: { xs: 140, sm: 200 }, flex: { xs: 1, sm: 'none' } }}>
                            <InputLabel>Lieu</InputLabel>
                            <Select
                                multiple
                                value={selectedLocations}
                                onChange={(e) => setSelectedLocations(e.target.value as string[])}
                                input={<OutlinedInput label="Lieu" />}
                                renderValue={(selected) => selected.length > 1 ? `${selected.length} lieux` : selected.join(', ')}
                                MenuProps={{ sx: { zIndex: 1500 } }}
                            >
                                {allLocations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        <Checkbox checked={selectedLocations.includes(location)} size="small" />
                                        <ListItemText primary={location} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <Chip
                                label="✕"
                                onDelete={() => {
                                    setSelectedMoods([]);
                                    setSelectedLocations([]);
                                }}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    </Box>
                </Collapse>
            </Paper>

            {/* Map */}
            <Paper sx={{ overflow: 'hidden', borderRadius: 2, mb: 2 }}>
                <Box sx={{ height: { xs: 350, sm: 500 }, width: '100%' }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={6}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Polyline connecting journal entries */}
                        {(viewMode === 'journal' || viewMode === 'both') && showPath && polylinePositions.length > 1 && (
                            <Polyline
                                positions={polylinePositions}
                                pathOptions={{
                                    color: '#1976d2',
                                    weight: 3,
                                    opacity: 0.7,
                                    dashArray: '10, 10',
                                }}
                            />
                        )}

                        {/* Journal entry markers */}
                        {(viewMode === 'journal' || viewMode === 'both') &&
                            steps.map((step) => {
                                const moodData = JOURNAL_MOODS.find((m) => m.value === step.mood);
                                const markerColor = moodData?.color || '#1976d2';

                                return (
                                    <Marker
                                        key={step.id}
                                        position={[step.lat, step.lng]}
                                        icon={createNumberedIcon(step.stepNumber, markerColor)}
                                    >
                                        <Popup>
                                            <Box sx={{ minWidth: 200 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    Étape {step.stepNumber}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                    <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDateLong(step.date)}
                                                    </Typography>
                                                </Stack>
                                                {step.location && (
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                        <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="body2">{step.location}</Typography>
                                                    </Stack>
                                                )}
                                                {moodData && (
                                                    <Chip
                                                        label={`${moodData.emoji} ${moodData.label}`}
                                                        size="small"
                                                        sx={{ mb: 1, bgcolor: `${moodData.color}20` }}
                                                    />
                                                )}
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {step.content}
                                                </Typography>
                                            </Box>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                        {/* Media markers */}
                        {(viewMode === 'media' || viewMode === 'both') &&
                            mediaMarkers.map((m) => (
                                <Marker key={m.id} position={[m.lat, m.lng]} icon={createPhotoIcon()}>
                                    <Popup>
                                        <Box sx={{ width: 150 }}>
                                            {m.type === 'photo' ? (
                                                <img
                                                    src={m.thumbnailUrl || m.url}
                                                    alt=""
                                                    style={{
                                                        width: '100%',
                                                        height: 100,
                                                        objectFit: 'cover',
                                                        borderRadius: 4,
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: 100,
                                                        bgcolor: 'grey.800',
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                    }}
                                                >
                                                    🎬 Vidéo
                                                </Box>
                                            )}
                                            {m.takenAt && (
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                    {formatDateLong(m.takenAt)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Popup>
                                </Marker>
                            ))}

                        <FitBounds positions={allPositions} />
                    </MapContainer>
                </Box>
            </Paper>

            {/* Steps list (only for journal view) */}
            {(viewMode === 'journal' || viewMode === 'both') && steps.length > 0 && (
                <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Itinéraire ({steps.length} étapes)
                    </Typography>
                    <Stack spacing={1}>
                        {steps.map((step, index) => {
                            const moodData = JOURNAL_MOODS.find((m) => m.value === step.mood);

                            return (
                                <Paper
                                    key={step.id}
                                    sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 1.5, sm: 2 },
                                        borderLeft: 3,
                                        borderColor: moodData?.color || 'primary.main',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: 28, sm: 32 },
                                            height: { xs: 28, sm: 32 },
                                            borderRadius: '50%',
                                            bgcolor: moodData?.color || 'primary.main',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: { xs: 12, sm: 14 },
                                            flexShrink: 0,
                                        }}
                                    >
                                        {step.stepNumber}
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {step.location || `Étape ${step.stepNumber}`}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDateLong(step.date)}
                                        </Typography>
                                    </Box>

                                    {moodData && (
                                        <Typography sx={{ fontSize: 18, flexShrink: 0 }}>
                                            {moodData.emoji}
                                        </Typography>
                                    )}
                                </Paper>
                            );
                        })}
                    </Stack>
                </>
            )}
        </Box>
    );
}
