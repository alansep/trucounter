import { Injectable } from '@angular/core';
import { StorageGateway } from '../../domain/gateways/storage-gateway';

@Injectable({ providedIn: 'root' })
export class LocalStorageAdapter implements StorageGateway {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable — silently fail
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch {
      // silently fail
    }
  }
}
