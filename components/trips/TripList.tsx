'use client';

import { useState } from 'react';
import { Grid, Button, Box } from '@mui/material';
import { Add as AddIcon, Luggage as LuggageIcon } from '@mui/icons-material';
import TripCard from './TripCard';
import TripForm from './TripForm';
import EmptyState from '@/components/common/EmptyState';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TripWithStats, TripFormData } from '@/types';

interface TripListProps {
  trips: TripWithStats[];
  onRefresh?: () => void;
}

export default function TripList({ trips, onRefresh }: TripListProps) {
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (data: TripFormData) => {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('trips')
      .insert({
        country: data.country,
        city: data.city || null,
        start_date: data.start_date,
        end_date: data.end_date || null,
        mood: data.mood || null,
        lat: data.lat || null,
        lng: data.lng || null,
        cover_image_url: data.cover_image_url || null,
        description: data.description || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating trip:', error);
      throw error;
    }

    // Recharger la liste
    onRefresh?.();
  };

  if (trips.length === 0) {
    return (
      <>
        <EmptyState
          icon={<LuggageIcon sx={{ fontSize: 64 }} />}
          title="Aucun voyage"
          description="Commencez par créer votre premier voyage pour enregistrer vos aventures."
          actionLabel="Créer un voyage"
          onAction={() => setFormOpen(true)}
        />

        <TripForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return (
    <Grid container spacing={3}>
      {trips.map((trip) => (
        <Grid key={trip.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <TripCard trip={trip} />
        </Grid>
      ))}
    </Grid>
  );
}
