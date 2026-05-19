export interface HealthMetrics {
  blinkRate: number;
  distance: number;
  screenTime: number;
}

export interface HealthStatus {
  isFatigued: boolean;
  needsBreak: boolean;
  skipCount: number;
}

export interface SessionData {
  startTime: Date | null;
  lastBreak: Date | null;
}

export interface HealthPayload {
  metrics: HealthMetrics;
  status: HealthStatus;
  session: SessionData;
}
