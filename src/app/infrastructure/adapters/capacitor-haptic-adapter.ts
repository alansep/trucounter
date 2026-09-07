import { Injectable } from '@angular/core';
import { HapticGateway } from '../../domain/gateways/haptic-gateway';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const HAPTIC_ENABLED_KEY = 'trucounter_haptic_enabled';

@Injectable({ providedIn: 'root' })
export class CapacitorHapticAdapter implements HapticGateway {
  async vibrate(): Promise<void> {
    try {
      const enabled = await this.isEnabled();
      if (enabled) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch {
      // Haptics not available — silently fail
    }
  }

  async isEnabled(): Promise<boolean> {
    try {
      const result = await Preferences.get({ key: HAPTIC_ENABLED_KEY });
      // Default to true if not set
      return result.value !== 'false';
    } catch {
      return true;
    }
  }

  async setEnabled(enabled: boolean): Promise<void> {
    try {
      await Preferences.set({ key: HAPTIC_ENABLED_KEY, value: String(enabled) });
    } catch {
      // silently fail
    }
  }
}
