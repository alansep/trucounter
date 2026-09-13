import { InjectionToken } from '@angular/core';
import { OrientationGateway } from './orientation-gateway';

export const ORIENTATION_GATEWAY = new InjectionToken<OrientationGateway>('OrientationGateway');
