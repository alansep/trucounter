import { Injectable, inject } from '@angular/core';
import { DisplayPreferenceGateway } from '../../domain/gateways/display-preference-gateway';
import { StorageGateway } from '../../domain/gateways/storage-gateway';
import { STORAGE_GATEWAY } from '../../domain/gateways/storage-gateway.token';
import { DisplayPreference } from '../../core/entity/display-preference';

const DISPLAY_PREFERENCE_KEY = 'trucounter_display_preference';

@Injectable({ providedIn: 'root' })
export class LocalDisplayPreferenceAdapter implements DisplayPreferenceGateway {
  private readonly storage = inject<StorageGateway>(STORAGE_GATEWAY);

  async getDisplayPreference(): Promise<DisplayPreference | null> {
    return this.storage.getItem<DisplayPreference>(DISPLAY_PREFERENCE_KEY);
  }

  async saveDisplayPreference(preference: DisplayPreference): Promise<void> {
    await this.storage.setItem(DISPLAY_PREFERENCE_KEY, preference);
  }
}
