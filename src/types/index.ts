export type MoodLevel = 'good' | 'somewhat-good' | 'normal' | 'somewhat-bad' | 'bad';

export type BloodFlow = 'light' | 'normal' | 'heavy';

export type DiscomfortType = 
  | 'headache' 
  | 'stomachache' 
  | 'nausea' 
  | 'diarrhea' 
  | 'constipation' 
  | 'fatigue' 
  | 'dizziness' 
  | 'other';

export type PMSSymptom = 
  | 'irritability' 
  | 'headache' 
  | 'dizziness' 
  | 'breast-tenderness' 
  | 'swelling' 
  | 'other';

export interface HealthRecord {
  date: string;
  mood?: MoodLevel;
  diary?: string;
  temperature?: number;
  weight?: number;
  bloodPressure?: {
    upper: number;
    lower: number;
  };
  heartRate?: number;
  discomforts?: DiscomfortType[];
  discomfortNote?: string;
  menstruation?: {
    bloodFlow?: BloodFlow;
    cramps?: boolean;
    pms?: PMSSymptom[];
    pmsOther?: string;
  };
}

export interface AppSettings {
  displayItems: string[];
  itemOrder: string[];
  discomfortOptions: string[];
  summaryItems: string[];
}

export interface AppData {
  records: Record<string, HealthRecord>;
  settings: AppSettings;
}