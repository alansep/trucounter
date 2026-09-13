import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { SettingsPage } from './settings.page';
import { DisplayPreferenceUsecase } from '../domain/usecases/display-preference-usecase';
import { DISPLAY_PREFERENCE_GATEWAY } from '../domain/gateways/display-preference-gateway.token';
import { DisplayPreferenceGateway } from '../domain/gateways/display-preference-gateway';
import { DisplayPreference } from '../core/entity/display-preference';

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

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let mockGateway: MockDisplayPreferenceGateway;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        DisplayPreferenceUsecase,
        { provide: DISPLAY_PREFERENCE_GATEWAY, useClass: MockDisplayPreferenceGateway },
      ],
    });

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    mockGateway = TestBed.inject(DISPLAY_PREFERENCE_GATEWAY) as unknown as MockDisplayPreferenceGateway;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with vertical view by default', async () => {
    await component.ngOnInit();
    expect(component.isHorizontal()).toBe(false);
  });

  it('should initialize with horizontal view when saved', async () => {
    await mockGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ngOnInit();
    expect(component.isHorizontal()).toBe(true);
  });

  it('should toggle to horizontal and persist', async () => {
    await component.ngOnInit();
    expect(component.isHorizontal()).toBe(false);

    const event = new CustomEvent('ionChange', { detail: { checked: true } });
    await component.onToggleChanged(event);

    expect(component.isHorizontal()).toBe(true);
    const saved = await mockGateway.getDisplayPreference();
    expect(saved?.view).toBe('horizontal');
  });

  it('should toggle back to vertical and persist', async () => {
    await mockGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ngOnInit();
    expect(component.isHorizontal()).toBe(true);

    const event = new CustomEvent('ionChange', { detail: { checked: false } });
    await component.onToggleChanged(event);

    expect(component.isHorizontal()).toBe(false);
    const saved = await mockGateway.getDisplayPreference();
    expect(saved?.view).toBe('vertical');
  });

  it('should render Configurações title', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const html = fixture.nativeElement.innerHTML as string;
    expect(html).toContain('Configurações');
  });

  it('should render toggle for horizontal view', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('ion-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should render toggle label Vista horizontal', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const html = fixture.nativeElement.innerHTML as string;
    expect(html).toContain('Vista horizontal');
  });
});
