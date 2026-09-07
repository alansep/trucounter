import { Provider } from '@angular/core';
import { GAME_GATEWAY } from './domain/gateways/game-gateway.token';
import { HAPTIC_GATEWAY } from './domain/gateways/haptic-gateway.token';
import { STORAGE_GATEWAY } from './domain/gateways/storage-gateway.token';
import { LocalGameAdapter } from './infrastructure/adapters/local-game-adapter';
import { CapacitorHapticAdapter } from './infrastructure/adapters/capacitor-haptic-adapter';
import { LocalStorageAdapter } from './infrastructure/adapters/local-storage-adapter';

export const APP_PROVIDERS: Provider[] = [
  { provide: STORAGE_GATEWAY, useClass: LocalStorageAdapter },
  { provide: GAME_GATEWAY, useClass: LocalGameAdapter },
  { provide: HAPTIC_GATEWAY, useClass: CapacitorHapticAdapter },
];
