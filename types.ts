export interface StyleOption {
  id: string;
  name: string;
  description: string;
  promptContext: string;
  icon: string;
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
