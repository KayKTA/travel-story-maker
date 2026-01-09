'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JOURNAL_MOODS } from '@/types/journal';
import type { JournalEntryWithMedia, MediaAsset } from '@/types';

interface TripMapViewProps {
    entries: JournalEntryWithMedia[];
    media: MediaAsset[];
    tripLat?: number | null;
    tripLng?: number | null;
    selectedEntryId?: string | null;
    onMarkerClick?: (entryId: string) => void;
    centerOnEntry?: JournalEntryWithMedia | null;
}

export default function TripMapView({
    entries,
    media,
    tripLat,
    tripLng,
    selectedEntryId,
    onMarkerClick,
    centerOnEntry,
}: TripMapViewProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Record<string, L.Marker>>({});
    const routeRef = useRef<L.Polyline | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize map
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Default center
        const defaultLat = tripLat || entries[0]?.lat || 48.8566;
        const defaultLng = tripLng || entries[0]?.lng || 2.3522;

        const map = L.map(containerRef.current, {
            center: [defaultLat, defaultLng],
            zoom: 10,
            zoomControl: true,
        });

        // Colorful map tiles - Using OpenStreetMap with nice colors
        // Option 1: Stadia Maps - Alidade Smooth (colorful & modern)
        // Option 2: Stamen Watercolor (artistic)
        // Option 3: OpenStreetMap Standard (more colorful than CartoDB)

        // Using OpenStreetMap with nice styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        // Alternative: Stadia Alidade Smooth (uncomment to use)
        // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
        //   maxZoom: 20,
        // }).addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Add/update markers
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        // Clear existing markers
        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};

        // Clear existing route
        if (routeRef.current) {
            routeRef.current.remove();
            routeRef.current = null;
        }

        if (entries.length === 0) return;

        const bounds = L.latLngBounds([]);
        const routeCoords: [number, number][] = [];

        // Add markers for each entry
        entries.forEach((entry, index) => {
            if (!entry.lat || !entry.lng) return;

            routeCoords.push([entry.lat, entry.lng]);

            const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
            const isSelected = selectedEntryId === entry.id;
            const isFirst = index === 0;
            const isLast = index === entries.length - 1;

            // Determine marker color
            let bgColor = moodData?.color || '#6B7280';
            let borderColor = '#FFFFFF';

            if (isFirst) {
                bgColor = '#10B981'; // Green for start
            } else if (isLast) {
                bgColor = '#6366F1'; // Purple for end
            }

            if (isSelected) {
                borderColor = '#FACC15'; // Yellow highlight
            }

            // Create custom icon with cleaner design
            const size = isSelected ? 38 : 30;
            const iconHtml = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${bgColor};
          border: 3px solid ${borderColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: ${isSelected ? 14 : 12}px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: ${isSelected
                    ? '0 0 0 4px rgba(250, 204, 21, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.25)'};
          transition: all 0.2s ease;
          cursor: pointer;
        ">
          ${index + 1}
        </div>
      `;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'custom-marker',
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });

            const marker = L.marker([entry.lat, entry.lng], { icon })
                .addTo(map)
                .on('click', () => {
                    onMarkerClick?.(entry.id);
                });

            // Popup content with modern design
            const photos = entry.media_assets?.filter((m) => m.media_type === 'photo') || [];
            const photoHtml = photos.length > 0
                ? `<div style="display: flex; gap: 4px; margin-top: 10px;">
            ${photos.slice(0, 3).map((p) =>
                    `<img src="${p.thumbnail_url || p.url}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px;" />`
                ).join('')}
            ${photos.length > 3
                    ? `<div style="width: 48px; height: 48px; background: #18181B; color: #FACC15; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">+${photos.length - 3}</div>`
                    : ''}
          </div>`
                : '';

            const statusLabel = isFirst ? 'Départ' : isLast ? 'Arrivée' : moodData?.label || 'Étape';
            const statusColor = isFirst ? '#10B981' : isLast ? '#6366F1' : bgColor;

            marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">${moodData?.emoji || '📍'}</span>
            <div>
              <div style="font-weight: 600; font-size: 15px; color: #18181B;">
                ${entry.location || 'Étape ' + (index + 1)}
              </div>
              <div style="font-size: 11px; color: ${statusColor}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ${statusLabel}
              </div>
            </div>
          </div>
          <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px; padding: 6px 0; border-top: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB;">
            ${new Date(entry.entry_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          ${entry.content
                    ? `<div style="font-size: 13px; color: #374151; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${entry.content.substring(0, 150)}${entry.content.length > 150 ? '...' : ''}
              </div>`
                    : ''}
          ${photoHtml}
        </div>
      `, {
                maxWidth: 280,
                className: 'custom-popup',
            });

            markersRef.current[entry.id] = marker;
            bounds.extend([entry.lat, entry.lng]);
        });

        // Draw route line with dashed style
        if (routeCoords.length > 1) {
            routeRef.current = L.polyline(routeCoords, {
                color: '#18181B',
                weight: 2,
                opacity: 0.7,
                dashArray: '8, 8',
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(map);
        }

        // Fit bounds with padding
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [60, 60] });
        }
    }, [entries, selectedEntryId, onMarkerClick]);

    // Center on selected entry
    useEffect(() => {
        if (!mapRef.current || !centerOnEntry?.lat || !centerOnEntry?.lng) return;

        mapRef.current.flyTo([centerOnEntry.lat, centerOnEntry.lng], 14, {
            duration: 0.5,
        });

        // Open popup
        const marker = markersRef.current[centerOnEntry.id];
        if (marker) {
            marker.openPopup();
        }
    }, [centerOnEntry]);

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#F8F9FA',
                '& .custom-marker': {
                    background: 'transparent !important',
                    border: 'none !important',
                },
                '& .leaflet-popup-content-wrapper': {
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    padding: 0,
                },
                '& .leaflet-popup-content': {
                    margin: '12px 14px',
                },
                '& .leaflet-popup-tip': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
                '& .leaflet-control-zoom': {
                    border: 'none !important',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1) !important',
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                },
                '& .leaflet-control-zoom-in, & .leaflet-control-zoom-out': {
                    border: 'none !important',
                    color: '#18181B !important',
                    '&:hover': {
                        bgcolor: '#F4F4F5 !important',
                    },
                },
            }}
        />
    );
}
