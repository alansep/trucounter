export type OrientationLock = 'portrait' | 'landscape';

export interface OrientationGateway {
  lock(orientation: OrientationLock): Promise<void>;
  unlock(): Promise<void>;
}
