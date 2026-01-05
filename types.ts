
export interface AnalysisResult {
  leafAreaCm2: number;
  perimeterCm: number;
  circularity: number; // 0 to 1
  meanGreenness: number; // 0-255 scale
  greennessIndex: number; // 0-100 scale
  confidence: number;
  metadata: {
    pixelToCmRatio: number;
    detectedLeafType?: string;
    dominantColorHex: string;
    leafState: string;
  };
  confidenceBreakdown: {
    segmentation: number; // 0-1
    calibration: number;  // 0-1
    colorFidelity: number; // 0-1
  };
  visualMarkers: {
    dot1: [number, number]; // [y, x] in normalized coordinates 0-1000
    dot2: [number, number];
    leafBoundingBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  };
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
