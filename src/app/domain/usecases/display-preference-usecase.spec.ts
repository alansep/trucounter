import { TestBed } from '@angular/core/testing';
import { DisplayPreferenceUsecase } from './display-preference-usecase';
import { DisplayPreferenceGateway } from '../gateways/display-preference-gateway';
import { DISPLAY_PREFERENCE_GATEWAY } from '../gateways/display-preference-gateway.token';
import { DisplayPreference } from '../../core/entity/display-preference';

class MockDisplayPreferenceGateway implements DisplayPreferenceGateway {
  private preference: DisplayPreference | null = null;

  async getDisplayPreference(): Promise<DisplayPreference | null> {
    return this.preference;
  }

  async saveDisplayPreference(preference: DisplayPreference): Promise<void> {
    this.preference = preference;
  }

  setPreference(preference: DisplayPreference | null): void {
    this.preference = preference;
  }
}

describe('DisplayPreferenceUsecase', () => {
  let usecase: DisplayPreferenceUsecase;
  let mockGateway: MockDisplayPreferenceGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DisplayPreferenceUsecase,
        { provide: DISPLAY_PREFERENCE_GATEWAY, useClass: MockDisplayPreferenceGateway },
      ],
    });

    usecase = TestBed.inject(DisplayPreferenceUsecase);
    mockGateway = TestBed.inject(DISPLAY_PREFERENCE_GATEWAY) as unknown as MockDisplayPreferenceGateway;
  });

  it('should be created', () => {
    expect(usecase).toBeTruthy();
  });

  describe('getView', () => {
    it('should return vertical as default when no preference saved', async () => {
      const view = await usecase.getView();
      expect(view).toBe('vertical');
    });

    it('should return horizontal when preference is horizontal', async () => {
      await mockGateway.saveDisplayPreference({ view: 'horizontal' });
      const view = await usecase.getView();
      expect(view).toBe('horizontal');
    });

    it('should return vertical when preference is vertical', async () => {
      await mockGateway.saveDisplayPreference({ view: 'vertical' });
      const view = await usecase.getView();
      expect(view).toBe('vertical');
    });

    it('should return vertical when preference data is corrupted', async () => {
      mockGateway.setPreference({ view: 'invalid' as 'vertical' | 'horizontal' });
      const view = await usecase.getView();
      expect(view).toBe('vertical');
    });

    it('should return vertical when preference is null', async () => {
      mockGateway.setPreference(null);
      const view = await usecase.getView();
      expect(view).toBe('vertical');
    });
  });

  describe('setView', () => {
    it('should save horizontal preference', async () => {
      await usecase.setView('horizontal');
      const view = await usecase.getView();
      expect(view).toBe('horizontal');
    });

    it('should save vertical preference', async () => {
      await usecase.setView('horizontal');
      await usecase.setView('vertical');
      const view = await usecase.getView();
      expect(view).toBe('vertical');
    });

    it('should overwrite previous preference', async () => {
      await usecase.setView('horizontal');
      await usecase.setView('vertical');
      const view = await usecase.getView();
      expect(view).toBe('vertical');
    });
  });
});
