import { DisplayPreference } from '../../core/entity/display-preference';

export interface DisplayPreferenceGateway {
  getDisplayPreference(): Promise<DisplayPreference | null>;
  saveDisplayPreference(preference: DisplayPreference): Promise<void>;
}
