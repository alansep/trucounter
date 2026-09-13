import { InjectionToken } from '@angular/core';
import { DisplayPreferenceGateway } from './display-preference-gateway';

export const DISPLAY_PREFERENCE_GATEWAY = new InjectionToken<DisplayPreferenceGateway>(
  'DisplayPreferenceGateway'
);
