import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { MenuComponent } from './menu.component';

@Component({
  template: '',
  standalone: false,
})
class StubGameComponent {}

@Component({
  template: '',
  standalone: false,
})
class StubSettingsComponent {}

@Component({
  template: '',
  standalone: false,
})
class StubOtherComponent {}

describe('MenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent, StubGameComponent, StubSettingsComponent, StubOtherComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([
          { path: 'game', component: StubGameComponent },
          { path: 'settings', component: StubSettingsComponent },
          { path: 'other', component: StubOtherComponent },
        ]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    // Arrange + Act
    const fixture = TestBed.createComponent(MenuComponent);

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should configure ion-menu for the main content with swipe gesture', async () => {
    // Arrange
    const fixture = TestBed.createComponent(MenuComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    const menu = fixture.nativeElement.querySelector('ion-menu') as HTMLElement;
    expect(menu).toBeTruthy();
    const contentId = menu.getAttribute('contentId') ?? menu.getAttribute('contentid');
    expect(contentId).toEqual('main-content');
    expect(menu.getAttribute('side')).toEqual('start');
  });

  it('should render Trucounter header with Jogo and Configurações items', async () => {
    // Arrange
    const fixture = TestBed.createComponent(MenuComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert — Stencil remove o textContent do light DOM no jsdom,
    // então verifica via innerHTML (comportamento documentado FW-6264).
    const html: string = fixture.nativeElement.innerHTML as string;
    expect(html).toContain('Trucounter');
    expect(html).toContain('Jogo');
    expect(html).toContain('Configurações');

    const labels = fixture.nativeElement.querySelectorAll('ion-label');
    expect(labels.length).toEqual(2);
  });

  it('should link Jogo to /game and Configurações to /settings inside ion-menu-toggle', async () => {
    // Arrange
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Act
    const router = TestBed.inject(Router);
    const links = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((el) => el.injector.get(RouterLink));

    // Assert
    expect(links.length).toEqual(2);
    expect(router.serializeUrl(links[0].urlTree!)).toEqual('/game');
    expect(router.serializeUrl(links[1].urlTree!)).toEqual('/settings');

    const toggles = fixture.nativeElement.querySelectorAll('ion-menu-toggle');
    expect(toggles.length).toEqual(2);
    expect(toggles[0].querySelector('ion-item')).toBeTruthy();
    expect(toggles[1].querySelector('ion-item')).toBeTruthy();
  });

  it('should navigate to /game when clicking Jogo', async () => {
    // Arrange
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await router.navigateByUrl('/other');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Act
    const item = fixture.debugElement.queryAll(By.directive(RouterLink))[0];
    expect(item).toBeTruthy();
    item.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(router.url).toEqual('/game');
  });

  it('should navigate to /settings when clicking Configurações', async () => {
    // Arrange
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await router.navigateByUrl('/other');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Act
    const item = fixture.debugElement.queryAll(By.directive(RouterLink))[1];
    expect(item).toBeTruthy();
    item.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(router.url).toEqual('/settings');
  });
});
