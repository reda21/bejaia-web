export type Locale = 'fr' | 'ar' | 'kab';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface LocalizedText {
  fr: string;
  ar: string;
  kab?: string;
}

export type CategorySlug =
  | 'balneaire'
  | 'montagne'
  | 'naturel'
  | 'grottes'
  | 'historique'
  | 'culturel'
  | 'thermal'
  | 'aventure';

export interface MediaAsset {
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
  source: string;
  attribution: string;
  isAiIllustration: boolean;
}

export interface DestinationSource {
  label: string;
  url?: string;
  verificationStatus: 'verified_institutional' | 'to_verify_field';
  verificationNote?: LocalizedText;
}

export interface Destination {
  id: string;
  slug: string;
  name: LocalizedText;
  commune: LocalizedText;
  region: LocalizedText;
  category: CategorySlug;
  secondaryCategories?: CategorySlug[];
  featured?: boolean;
  shortDescription: LocalizedText;
  overview: LocalizedText;
  tourismDescription: LocalizedText;
  historyAndHeritage?: LocalizedText;
  characteristics: LocalizedText[];
  visitTips: LocalizedText[];
  practicalInfo: {
    accessNote: LocalizedText;
    seasonNote: LocalizedText;
    verificationNotice?: LocalizedText;
  };
  /** Query used with Google Maps Places API (New) to resolve verified live coordinates and Google Maps URI */
  mapsSearchQuery: string;
  /** OpenStreetMap search fallback query (never invents fake coordinates) */
  osmSearchQuery: string;
  coverImage: MediaAsset;
  gallery: MediaAsset[];
  sources: DestinationSource[];
}

export interface CategoryDefinition {
  slug: CategorySlug;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  editorialIntro: LocalizedText;
  accentColor: string;
  coverImage: MediaAsset;
  highlights: LocalizedText[];
}

export interface Circuit {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  theme: CategorySlug;
  destinationSlugs: string[];
  documentedDuration?: LocalizedText;
  durationNote: LocalizedText;
  coverImage: MediaAsset;
  highlights: LocalizedText[];
  source: string;
}

export interface CustomCircuit {
  id: string;
  name: string;
  destinationSlugs: string[];
  createdAt: string;
}

export interface CultureArticle {
  id: string;
  slug: string;
  theme: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText[];
  keyElements: LocalizedText[];
  coverImage: MediaAsset;
  source: string;
}

export interface GroundingPlaceLink {
  title: string;
  uri: string;
  placeId?: string;
  reviewSnippets?: string[];
}

export interface MapsGroundingResponse {
  text: string;
  places: GroundingPlaceLink[];
  error?: string;
}

export interface ResolvedMapLocation {
  slug: string;
  lat: number;
  lng: number;
  formattedAddress?: string;
  googleMapsURI?: string;
  placeId?: string;
  displayName?: string;
}

export type EraSlug =
  | 'antiquite'
  | 'hammadide'
  | 'medieval-savant'
  | 'ottoman-espagnol'
  | 'contemporain'
  | 'patrimoine-naturel';

export interface SourceCitation {
  id: string;
  code: string;
  label: string;
  url?: string;
  verificationStatus: 'verified_institutional' | 'historical_archive' | 'to_verify_field';
  note?: LocalizedText;
}

export interface HistoricalEra {
  id: string;
  slug: EraSlug;
  order: string;
  dateRange: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  summary: LocalizedText;
  paragraphs: LocalizedText[];
  pullQuote?: LocalizedText;
  keyMilestones: LocalizedText[];
  relatedDestinations: string[];
  relatedFigures: string[];
  sources: SourceCitation[];
  verificationNotice?: LocalizedText;
  coverImage: MediaAsset;
}

export interface HistoricalFigure {
  id: string;
  slug: string;
  name: LocalizedText;
  dates: LocalizedText;
  domain: LocalizedText;
  era: EraSlug;
  bejaiaConnection: LocalizedText;
  biography: LocalizedText[];
  relatedDestinations: string[];
  sources: SourceCitation[];
}

export interface MedinaLayer {
  id: string;
  order: string;
  title: LocalizedText;
  period: LocalizedText;
  attestationStatus: 'attested_vestiges' | 'partial_traces' | 'historical_mention';
  description: LocalizedText;
  attestationNote: LocalizedText;
  relatedDestinations: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  arabicScript: string;
  kabyleTerm?: string;
  kabyleStatus: 'validated_common' | 'pending_official_validation';
  category: 'architecture' | 'geographie' | 'tradition';
  definition: LocalizedText;
  relatedDestinations: string[];
}

export interface NaturalistDossier {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  ecosystemType: LocalizedText;
  summary: LocalizedText;
  sections: {
    heading: LocalizedText;
    body: LocalizedText;
  }[];
  speciesOrFormations: LocalizedText[];
  relatedDestinations: string[];
  sources: SourceCitation[];
  coverImage: MediaAsset;
}

export interface DestinationHistoryMeta {
  eras: EraSlug[];
  citations: SourceCitation[];
}

export interface ReaderPreferences {
  fontScale: 'standard' | 'comfort' | 'large';
  readerMode: boolean;
}

export interface DestinationJournalNote {
  note: string;
  updatedAt: string;
}

export interface ExportableExplorerBundle {
  version: number;
  exportedAt: string;
  favorites: string[];
  visitedSlugs: string[];
  notes: Record<string, DestinationJournalNote>;
  savedCircuits: CustomCircuit[];
}

export interface RouteSummaryResult {
  distanceText?: string;
  durationText?: string;
  stopsCount: number;
}

export interface WeatherForecastDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number | null;
  windGustsMax?: number | null;
  precipitationSum?: number | null;
  snowfallSum?: number | null;
}

export type WeatherAlertType =
  | 'coastal_storm'
  | 'mountain_snow'
  | 'heavy_rain'
  | 'heatwave';

export interface WeatherAlert {
  id: string;
  type: WeatherAlertType;
  severity: 'advisory' | 'severe';
  zone: 'coast' | 'mountain' | 'wilaya';
  title: LocalizedText;
  description: LocalizedText;
  advice: LocalizedText;
  metricLabel?: string;
}

export interface MountainWeatherSnapshot {
  location: LocalizedText;
  elevationLabel: string;
  temperature: number;
  windGusts: number;
  weatherCode: number;
}

export interface BejaiaWeatherData {
  location: string;
  fetchedAt: string;
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    windGusts?: number;
    weatherCode: number;
    isDay: boolean;
  };
  mountain?: MountainWeatherSnapshot;
  alerts: WeatherAlert[];
  forecast: WeatherForecastDay[];
  source: string;
}

export interface ExchangeRatesPayload {
  base: 'DZD';
  updatedAtUtc: string;
  fetchedAt: string;
  rates: Record<string, number>;
  source: string;
}



