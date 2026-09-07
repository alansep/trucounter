import { InjectionToken } from '@angular/core';
import { HapticGateway } from './haptic-gateway';

export const HAPTIC_GATEWAY = new InjectionToken<HapticGateway>('HapticGateway');
