import { InjectionToken } from '@angular/core';
import { StorageGateway } from './storage-gateway';

export const STORAGE_GATEWAY = new InjectionToken<StorageGateway>('StorageGateway');
