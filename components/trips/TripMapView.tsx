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

        // Tile layer - using CartoDB for a clean look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
        }).addTo(map);

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

        if (entries.length === 0) return;

        const bounds = L.latLngBounds([]);

        // Add markers for each entry
        entries.forEach((entry, index) => {
            if (!entry.lat || !entry.lng) return;

            const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
            const isSelected = selectedEntryId === entry.id;
            const color = moodData?.color || '#1A1A1A';

            // Create custom icon
            const iconHtml = `
        <div style="
          width: ${isSelected ? 36 : 28}px;
          height: ${isSelected ? 36 : 28}px;
          background: ${color};
          border: 3px solid ${isSelected ? '#F5B82E' : '#FFFDF5'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: ${isSelected ? 14 : 12}px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: ${isSelected ? '0 0 0 4px rgba(245, 184, 46, 0.3), ' : ''}0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
        ">
          ${index + 1}
        </div>
      `;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'custom-marker',
                iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
                iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
            });

            const marker = L.marker([entry.lat, entry.lng], { icon })
                .addTo(map)
                .on('click', () => {
                    onMarkerClick?.(entry.id);
                });

            // Popup content
            const photos = entry.media_assets?.filter((m) => m.media_type === 'photo') || [];
            const photoHtml = photos.length > 0
                ? `<div style="display: flex; gap: 4px; margin-top: 8px;">
            ${photos.slice(0, 2).map((p) =>
                    `<img src="${p.thumbnail_url || p.url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />`
                ).join('')}
            ${photos.length > 2 ? `<div style="width: 50px; height: 50px; background: #1A1A1A; color: #F5B82E; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">+${photos.length - 2}</div>` : ''}
          </div>`
                : '';

            marker.bindPopup(`
        <div style="font-family: 'DM Sans', sans-serif; min-width: 180px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">
            ${moodData?.emoji || ''} ${entry.location || 'Étape ' + (index + 1)}
          </div>
          <div style="font-size: 12px; color: #666; margin-bottom: 6px;">
            ${new Date(entry.entry_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
          </div>
          <div style="font-size: 13px; color: #333; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${entry.content?.substring(0, 150)}${entry.content && entry.content.length > 150 ? '...' : ''}
          </div>
          ${photoHtml}
        </div>
      `, {
                maxWidth: 250,
                className: 'custom-popup',
            });

            markersRef.current[entry.id] = marker;
            bounds.extend([entry.lat, entry.lng]);
        });

        // Draw route line
        const routeCoords = entries
            .filter((e) => e.lat && e.lng)
            .map((e) => [e.lat!, e.lng!] as [number, number]);

        if (routeCoords.length > 1) {
            L.polyline(routeCoords, {
                color: '#1A1A1A',
                weight: 3,
                opacity: 0.6,
                dashArray: '8, 8',
            }).addTo(map);
        }

        // Fit bounds
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
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
                '& .custom-marker': {
                    background: 'transparent',
                    border: 'none',
                },
                '& .leaflet-popup-content-wrapper': {
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                },
                '& .leaflet-popup-tip': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            }}
        />
    );
}
