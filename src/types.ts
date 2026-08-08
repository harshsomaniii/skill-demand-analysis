export interface JobAd {
  id: string;
  newspaper: string;
  edition: string;
  date: string; // YYYY-MM-DD
  page_number: string; // e.g., "Page 8" or "8"
  company: string;
  job_title: string;
  job_location: string;
  original_advertisement: string;
  
  // Extended fields for enriched research
  category?: 'Government / PSU' | 'Private Sector' | 'Education & Academic' | 'Healthcare & Hospitals' | 'Banking & Finance' | 'Classifieds / Other';
  qualification?: string;
  deadline?: string;
  contact_info?: string;
  imageUrl?: string;
  extractedAt: string;
  confidenceScore?: number;
}

export interface EpaperEdition {
  id: string;
  city: string;
  subCity: string;
  displayName: string;
  district: string;
  totalPagesDefault: number;
}

export interface ScrapeJobTask {
  id: string;
  newspaper: string;
  city: string;
  edition: string;
  date: string;
  pagesTotal: number;
  pagesScanned: number;
  adsFoundCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface InspectionPattern {
  id: string;
  name: string;
  urlTemplate: string;
  sampleDate: string;
  sampleCity: string;
  sampleSubCity: string;
  notes: string;
}
