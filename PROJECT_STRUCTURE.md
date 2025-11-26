# Travel Story Maker - Structure du Projet

## 🗂️ Arborescence Complète

```
travel-story-maker/
├── app/
│   ├── layout.tsx                    # Layout racine avec AppLayout
│   ├── page.tsx                      # Home - Dashboard principal
│   ├── globals.css                   # Styles globaux
│   ├── providers.tsx                 # MUI ThemeProvider + autres providers
│   │
│   ├── trips/
│   │   ├── page.tsx                  # Liste des voyages
│   │   └── [id]/
│   │       └── page.tsx              # Détail voyage avec onglets
│   │
│   ├── journal/
│   │   ├── page.tsx                  # Journal global
│   │   └── [id]/
│   │       └── page.tsx              # Détail entrée journal
│   │
│   ├── expenses/
│   │   └── page.tsx                  # Dépenses globales
│   │
│   ├── stories/
│   │   └── page.tsx                  # Travel Story Maker
│   │
│   ├── map/
│   │   └── page.tsx                  # Carte globale
│   │
│   └── api/
│       ├── trips/
│       │   └── route.ts              # CRUD trips
│       ├── journal/
│       │   ├── route.ts              # CRUD journal_entries
│       │   └── transcribe/
│       │       └── route.ts          # API transcription audio
│       ├── expenses/
│       │   ├── route.ts              # CRUD expenses
│       │   └── extract/
│       │       └── route.ts          # API OCR ticket (mock)
│       ├── stories/
│       │   └── route.ts              # CRUD stories
│       ├── media/
│       │   ├── route.ts              # CRUD media_assets
│       │   └── extract-metadata/
│       │       └── route.ts          # API extraction EXIF
│       └── reels/
│           └── generate/
│               └── route.ts          # API génération reels (mock V2)
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx             # Layout principal avec navigation
│   │   ├── PageHeader.tsx            # En-tête de page réutilisable
│   │   └── Sidebar.tsx               # Navigation latérale
│   │
│   ├── trips/
│   │   ├── TripList.tsx              # Liste des voyages
│   │   ├── TripCard.tsx              # Card voyage
│   │   ├── TripForm.tsx              # Formulaire création/édition
│   │   └── TripTabs.tsx              # Onglets détail voyage
│   │
│   ├── journal/
│   │   ├── JournalList.tsx           # Liste entrées journal
│   │   ├── JournalEntryCard.tsx      # Card entrée journal
│   │   ├── JournalForm.tsx           # Formulaire journal
│   │   ├── JournalMediaSection.tsx   # Section médias d'une entrée
│   │   └── AudioTranscriptionUploader.tsx  # Upload audio → transcription
│   │
│   ├── media/
│   │   ├── MediaGallery.tsx          # Galerie photos/vidéos
│   │   ├── MediaUpload.tsx           # Upload multi-fichiers
│   │   ├── MediaCard.tsx             # Card média individuel
│   │   └── MediaMap.tsx              # Carte avec médias positionnés
│   │
│   ├── expenses/
│   │   ├── ExpenseList.tsx           # Liste dépenses (cards)
│   │   ├── ExpenseTable.tsx          # Table MUI dépenses
│   │   ├── ExpenseForm.tsx           # Formulaire dépense
│   │   ├── ExpenseStats.tsx          # Statistiques dépenses
│   │   └── ReceiptUpload.tsx         # Upload ticket + OCR
│   │
│   ├── stories/
│   │   ├── StoryList.tsx             # Liste stories générées
│   │   ├── StoryCard.tsx             # Card story
│   │   └── StoryForm.tsx             # Formulaire génération story
│   │
│   ├── map/
│   │   ├── MapView.tsx               # Composant map générique (Leaflet)
│   │   ├── TripMap.tsx               # Carte d'un voyage spécifique
│   │   ├── GlobalMap.tsx             # Carte globale tous voyages
│   │   └── MapMarker.tsx             # Marker personnalisé
│   │
│   └── common/
│       ├── ConfirmDialog.tsx         # Dialog de confirmation
│       ├── EmptyState.tsx            # État vide
│       ├── LoadingState.tsx          # État chargement
│       ├── FilterBar.tsx             # Barre de filtres
│       ├── MoodSelector.tsx          # Sélecteur d'humeur
│       └── DateRangePicker.tsx       # Sélecteur période
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Client Supabase (browser)
│   │   ├── server.ts                 # Client Supabase (server)
│   │   └── middleware.ts             # Middleware auth (optionnel)
│   │
│   ├── utils/
│   │   ├── formatters.ts             # Formatage dates, nombres, etc.
│   │   ├── exif.ts                   # Extraction métadonnées EXIF
│   │   ├── validators.ts             # Validation données
│   │   └── constants.ts              # Constantes (catégories, moods, etc.)
│   │
│   ├── hooks/
│   │   ├── useTrips.ts               # Hook gestion voyages
│   │   ├── useJournal.ts             # Hook gestion journal
│   │   ├── useExpenses.ts            # Hook gestion dépenses
│   │   ├── useStories.ts             # Hook gestion stories
│   │   ├── useMedia.ts               # Hook gestion médias
│   │   └── useMap.ts                 # Hook gestion carte
│   │
│   └── actions/
│       ├── trips.ts                  # Server actions trips
│       ├── journal.ts                # Server actions journal
│       ├── expenses.ts               # Server actions expenses
│       ├── stories.ts                # Server actions stories
│       └── media.ts                  # Server actions media
│
├── types/
│   ├── index.ts                      # Export centralisé
│   ├── trip.ts                       # Types Trip
│   ├── journal.ts                    # Types JournalEntry
│   ├── expense.ts                    # Types Expense
│   ├── story.ts                      # Types Story
│   ├── media.ts                      # Types MediaAsset
│   └── api.ts                        # Types API responses
│
├── styles/
│   └── theme.ts                      # Configuration thème MUI
│
├── public/
│   ├── icons/                        # Icônes personnalisées
│   └── images/                       # Images statiques
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Migration initiale
│
├── .env.local.example                # Variables d'environnement exemple
├── next.config.js                    # Configuration Next.js
├── package.json                      # Dépendances
├── tsconfig.json                     # Configuration TypeScript
└── README.md                         # Documentation projet
```

## 📊 Flux de données

### Upload Audio → Transcription
```
User → AudioTranscriptionUploader → POST /api/journal/transcribe
                                         ↓
                                   (mock: texte factice)
                                         ↓
                                   content dans JournalForm
                                         ↓
                                   Sauvegarde journal_entries
```

### Upload Photo/Vidéo → EXIF → Media
```
User → MediaUpload → Supabase Storage (upload fichier)
                          ↓
                   POST /api/media/extract-metadata
                          ↓
                   Extraction EXIF (date, GPS, etc.)
                          ↓
                   INSERT media_assets (avec métadonnées)
```

### Scan Ticket → OCR → Dépense
```
User → ReceiptUpload → POST /api/expenses/extract
                            ↓
                      (mock: données factices)
                            ↓
                      Pré-remplissage ExpenseForm
                            ↓
                      Sauvegarde expenses
```

### Génération Story (future)
```
User → StoryForm → POST /api/stories
                        ↓
                  (V2: appel LLM avec contexte)
                        ↓
                  INSERT stories
```

### Génération Reel (future V2)
```
User → POST /api/reels/generate
            ↓
      (mock: URL factice)
            ↓
      (V2: traitement vidéo réel)
```
