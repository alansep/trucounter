import { Injectable, inject } from '@angular/core';
import { DisplayPreference, DisplayView } from '../../core/entity/display-preference';
import { DisplayPreferenceGateway } from '../gateways/display-preference-gateway';
import { DISPLAY_PREFERENCE_GATEWAY } from '../gateways/display-preference-gateway.token';

const VALID_VIEWS: DisplayView[] = ['vertical', 'horizontal'];

@Injectable({ providedIn: 'root' })
export class DisplayPreferenceUsecase {
  private readonly gateway = inject<DisplayPreferenceGateway>(DISPLAY_PREFERENCE_GATEWAY);

  async getView(): Promise<DisplayView> {
    const preference = await this.gateway.getDisplayPreference();
    if (!preference || !this.isValid(preference.view)) {
      return 'vertical';
    }
    return preference.view;
  }

  async setView(view: DisplayView): Promise<void> {
    await this.gateway.saveDisplayPreference({ view });
  }

  private isValid(view: unknown): view is DisplayView {
    return typeof view === 'string' && VALID_VIEWS.includes(view as DisplayView);
  }
}
